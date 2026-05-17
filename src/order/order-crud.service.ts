import { PinoLogger } from 'nestjs-pino';
import { BaseCrudService } from '../common/services/CRUD/base-crud.service';
import { Order, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NamePrismaModels } from '../prisma/types/name-prisma-models.enum';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';

export abstract class OrderCrudService extends BaseCrudService<
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  Prisma.OrderWhereUniqueInput
> {
  constructor(prisma: PrismaService, logger: PinoLogger) {
    super(logger, prisma.order as never, NamePrismaModels.ORDER);
  }
}
