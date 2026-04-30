import { PinoLogger } from 'nestjs-pino';
import { BaseCrudService } from '../common/services/CRUD/base-crud.service';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NamePrismaModels } from '../prisma/types/name-prisma-models.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

export abstract class UserCrudService extends BaseCrudService<
  User,
  CreateUserDto,
  UpdateUserDto,
  Prisma.UserWhereUniqueInput
> {
  constructor(prisma: PrismaService, logger: PinoLogger) {
    super(logger, prisma.user, NamePrismaModels.USER);
  }
}
