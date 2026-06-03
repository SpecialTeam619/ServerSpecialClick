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

  async isUserExist(
    phone: Prisma.UserWhereUniqueInput,
  ): Promise<{ exists: boolean }> {
    try {
      await super.findOne(phone);
      return { exists: true };
    } catch {
      return { exists: false };
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
    const user = await this.prisma.user.delete({
      where: id,
      select: { id: true, name: true, phone: true, role: true },
    });

    return user as User;
  }
}
