import { Injectable } from '@nestjs/common';
import { Order, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';
import { OrderCrudService } from './order-crud.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  PaginatedResponse,
  PaginationParams,
} from '../common/interface/paginated.interface';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService extends OrderCrudService {
  constructor(prisma: PrismaService, logger: PinoLogger) {
    super(prisma, logger);
  }

  async createOrder(
    createDto: CreateOrderDto,
    lessorId: string,
  ): Promise<Order> {
    return super.create({
      ...createDto,
      lessorId,
    });
  }

  async findAll(
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<Order>> {
    return super.findAll(params);
  }

  async findOne(id: Prisma.OrderWhereUniqueInput): Promise<Order> {
    return super.findOne(id);
  }

  async update(
    id: Prisma.OrderWhereUniqueInput,
    updateDto: UpdateOrderDto,
  ): Promise<Order> {
    return super.update(id, updateDto);
  }

  async remove(id: Prisma.OrderWhereUniqueInput): Promise<Order> {
    return super.remove(id);
  }
}
