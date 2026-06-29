import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResponse } from '../common/interface/paginated.interface';
import { PinoLogger } from 'nestjs-pino';
import { UserCrudService } from './user-crud.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class UserService extends UserCrudService {
  protected readonly prisma: PrismaService;

  constructor(prisma: PrismaService, logger: PinoLogger) {
    super(prisma, logger);
    this.prisma = prisma;
  }

  async createUser(createDto: CreateUserDto): Promise<User> {
    return super.create(createDto);
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponse<User>> {
    return super.findAll(query);
  }

  async findOne(id: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: id,
      select: { id: true, name: true, phone: true, role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as User;
  }

  async findOneWithPassword(
    id: Prisma.UserWhereUniqueInput,
  ): Promise<User & { password: string }> {
    const user = await this.prisma.user.findUnique({
      where: id,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as User & { password: string };
  }

  async isUserExist(
    phone: Prisma.UserWhereUniqueInput,
  ): Promise<{ exists: boolean }> {
    try {
      await super.findOne(phone);
      return { exists: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { exists: false };
      }

      throw error;
    }
  }

  async update(
    id: Prisma.UserWhereUniqueInput,
    updateDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: id,
      data: updateDto,
      select: { id: true, name: true, phone: true, role: true },
    });

    return user as User;
  }

  async remove(id: Prisma.UserWhereUniqueInput): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: id,
      select: { id: true, name: true, phone: true, role: true },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const relatedOrders = await tx.order.findMany({
        where: {
          OR: [{ customerId: existingUser.id }, { lessorId: existingUser.id }],
        },
        select: { id: true },
      });
      const relatedOrderIds = relatedOrders.map((order) => order.id);

      const chatMessageWhere: Prisma.ChatMessageWhereInput = {
        OR: [{ senderId: existingUser.id }],
      };

      if (relatedOrderIds.length > 0) {
        chatMessageWhere.OR?.push({ orderId: { in: relatedOrderIds } });
      }

      await tx.chatMessage.deleteMany({ where: chatMessageWhere });
      await tx.order.deleteMany({
        where: {
          OR: [{ customerId: existingUser.id }, { lessorId: existingUser.id }],
        },
      });
      await tx.technique.deleteMany({ where: { ownerId: existingUser.id } });

      const user = await tx.user.delete({
        where: { id: existingUser.id },
        select: { id: true, name: true, phone: true, role: true },
      });

      return user as User;
    });
  }
}
