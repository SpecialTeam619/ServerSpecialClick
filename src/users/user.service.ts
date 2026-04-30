import { Injectable } from '@nestjs/common';
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
  constructor(prisma: PrismaService, logger: PinoLogger) {
    super(prisma, logger);
  }

  async createUser(createDto: CreateUserDto): Promise<User> {
    return super.create(createDto);
  }

  async findAll(query: PaginationDto): Promise<PaginatedResponse<User>> {
    return super.findAll(query);
  }

  async findOne(id: Prisma.UserWhereUniqueInput): Promise<User> {
    return super.findOne(id);
  }

  async update(
    id: Prisma.UserWhereUniqueInput,
    updateDto: UpdateUserDto,
  ): Promise<User> {
    return super.update(id, updateDto);
  }

  async remove(id: Prisma.UserWhereUniqueInput): Promise<User> {
    return super.remove(id);
  }
}
