import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Order,
  Prisma,
  StatusOrder,
  StatusTechnique,
} from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';
import { OrderCrudService } from './order-crud.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginatedResponse } from '../common/interface/paginated.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateOrderMessageDto } from './dto/create-order-message.dto';

type OrderStatusValue = StatusOrder | 'REJECTED';

type OrderWithRelations = Order & {
  techniqueId?: string | null;
  customer?: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
  lessor?: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
  technique?: unknown;
};

type OrderModelWithTechnique = {
  create(args: unknown): Promise<OrderWithRelations>;
  findMany(args: unknown): Promise<OrderWithRelations[]>;
  count(args: unknown): Promise<number>;
  findUnique(args: unknown): Promise<OrderWithRelations | null>;
  update(args: unknown): Promise<OrderWithRelations>;
};

type ChatMessageWithSender = {
  id: string;
  orderId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  sender?: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
};

type ChatMessageModel = {
  findMany(args: unknown): Promise<ChatMessageWithSender[]>;
  create(args: unknown): Promise<ChatMessageWithSender>;
};

const ORDER_INCLUDE = {
  customer: {
    select: { id: true, name: true, phone: true, role: true },
  },
  lessor: {
    select: { id: true, name: true, phone: true, role: true },
  },
  technique: {
    include: {
      techniqueType: true,
      owner: {
        select: { id: true, name: true, phone: true, role: true },
      },
    },
  },
};

const REJECTED_STATUS = 'REJECTED';
const ORDER_STATUS_FLOW: Partial<Record<OrderStatusValue, OrderStatusValue[]>> =
  {
    AWAITING: [StatusOrder.ON_THE_WAY, REJECTED_STATUS],
    ON_THE_WAY: [StatusOrder.IN_PROGRESS],
    IN_PROGRESS: [StatusOrder.COMPLETED],
  };

const CHAT_AVAILABLE_STATUSES: OrderStatusValue[] = [
  StatusOrder.ON_THE_WAY,
  StatusOrder.IN_PROGRESS,
  StatusOrder.COMPLETED,
];

@Injectable()
export class OrderService extends OrderCrudService {
  protected readonly prisma: PrismaService;

  constructor(prisma: PrismaService, logger: PinoLogger) {
    super(prisma, logger);
    this.prisma = prisma;
  }

  private get orderModel(): OrderModelWithTechnique {
    return this.prisma.order as unknown as OrderModelWithTechnique;
  }

  private get chatMessageModel(): ChatMessageModel {
    return this.prisma.chatMessage as unknown as ChatMessageModel;
  }

  async createOrder(
    createDto: CreateOrderDto,
    customerId: string,
  ): Promise<Order> {
    const technique = await this.prisma.technique.findUnique({
      where: { id: createDto.techniqueId },
    });

    if (!technique) {
      throw new NotFoundException('Technique not found');
    }

    if (technique.ownerId === customerId) {
      throw new BadRequestException(
        'Вы не можете арендовать свою собственную технику',
      );
    }

    if (technique.status !== StatusTechnique.IN_STOCK) {
      throw new BadRequestException('Техника не доступна для аренды');
    }

    const order = await this.orderModel.create({
      data: {
        customerId,
        lessorId: technique.ownerId,
        techniqueId: technique.id,
        status: StatusOrder.AWAITING,
        objectAddress: createDto.objectAddress,
        arrivalAt: new Date(createDto.arrivalAt),
        paymentMode: createDto.paymentMode,
      },
      include: ORDER_INCLUDE,
    });

    await this.prisma.technique.update({
      where: { id: technique.id },
      data: { status: StatusTechnique.RENTED },
    });

    return order;
  }

  async findAll(
    params: PaginationDto = {},
    userId?: string,
    role?: string,
  ): Promise<PaginatedResponse<Order>> {
    if (!userId) {
      throw new ForbiddenException('User is required to read orders');
    }

    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const where =
      role === 'ADMIN'
        ? {}
        : role === 'LESSOR'
          ? { lessorId: userId }
          : { customerId: userId };

    const [data, total] = await Promise.all([
      this.orderModel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: ORDER_INCLUDE,
      }),
      this.orderModel.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as Order[],
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(
    id: Prisma.OrderWhereUniqueInput,
    userId?: string,
    role?: string,
  ): Promise<Order> {
    if (!userId) {
      throw new ForbiddenException('User is required to read this order');
    }

    const order = await this.orderModel.findUnique({
      where: id,
      include: ORDER_INCLUDE,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    this.assertCanReadOrder(order, userId, role);

    return order as Order;
  }

  async update(
    id: Prisma.OrderWhereUniqueInput,
    updateDto: UpdateOrderDto,
    userId?: string,
    role?: string,
  ): Promise<Order> {
    if (!userId) {
      throw new ForbiddenException('User is required to update this order');
    }

    const order = await this.orderModel.findUnique({
      where: id,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    this.assertCanManageOrder(order, userId, role);
    this.assertAllowedStatusTransition(order.status, updateDto.status);

    await this.orderModel.update({
      where: id,
      data: { status: updateDto.status },
    });

    if (
      order.techniqueId &&
      (updateDto.status === REJECTED_STATUS ||
        updateDto.status === StatusOrder.COMPLETED)
    ) {
      await this.prisma.technique.update({
        where: { id: order.techniqueId },
        data: { status: StatusTechnique.IN_STOCK },
      });
    }

    const updatedOrder = await this.orderModel.findUnique({
      where: id,
      include: ORDER_INCLUDE,
    });

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    return updatedOrder as Order;
  }

  async remove(id: Prisma.OrderWhereUniqueInput): Promise<Order> {
    return super.remove(id);
  }

  async findMessages(
    orderId: string,
    userId: string,
    role?: string,
  ): Promise<ChatMessageWithSender[]> {
    const order = await this.getOrderForChat(orderId, userId, role);

    this.assertChatAvailable(order);

    return this.chatMessageModel.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, phone: true, role: true },
        },
      },
    });
  }

  async createMessage(
    orderId: string,
    dto: CreateOrderMessageDto,
    userId: string,
    role?: string,
  ): Promise<ChatMessageWithSender> {
    const order = await this.getOrderForChat(orderId, userId, role);

    this.assertChatAvailable(order);

    const text = dto.text.trim();

    if (!text) {
      throw new BadRequestException('Message text is required');
    }

    return this.chatMessageModel.create({
      data: {
        orderId,
        senderId: userId,
        text,
      },
      include: {
        sender: {
          select: { id: true, name: true, phone: true, role: true },
        },
      },
    });
  }

  private assertCanReadOrder(
    order: OrderWithRelations,
    userId: string,
    role?: string,
  ) {
    if (
      role === 'ADMIN' ||
      order.customerId === userId ||
      order.lessorId === userId
    ) {
      return;
    }

    throw new ForbiddenException('You do not have access to this order');
  }

  private assertCanManageOrder(
    order: OrderWithRelations,
    userId: string,
    role?: string,
  ) {
    if (role === 'ADMIN' || (role === 'LESSOR' && order.lessorId === userId)) {
      return;
    }

    throw new ForbiddenException('Only the lessor can update this order');
  }

  private assertAllowedStatusTransition(
    currentStatus: OrderStatusValue,
    nextStatus: OrderStatusValue,
  ) {
    const allowedNextStatuses = ORDER_STATUS_FLOW[currentStatus] ?? [];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new BadRequestException(
        `Cannot change order status from ${currentStatus} to ${nextStatus}`,
      );
    }
  }

  private async getOrderForChat(
    orderId: string,
    userId: string,
    role?: string,
  ): Promise<OrderWithRelations> {
    const order = await this.orderModel.findUnique({
      where: { id: orderId },
      include: ORDER_INCLUDE,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    this.assertCanReadOrder(order, userId, role);

    return order;
  }

  private assertChatAvailable(order: OrderWithRelations) {
    if (CHAT_AVAILABLE_STATUSES.includes(order.status)) {
      return;
    }

    throw new BadRequestException(
      'Chat is available only after the lessor accepts the order',
    );
  }
}
