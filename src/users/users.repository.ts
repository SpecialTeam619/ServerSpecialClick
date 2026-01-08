import { inject, injectable } from 'inversify';
import { UserModel } from '../prisma/generated/client';
import { User } from './users.entity';
import { IUsersRepository } from './users.repository.interface';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';

@injectable()
export class UsersRepository implements IUsersRepository {
    constructor(
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {}

    async create({ email, password, name }: User): Promise<UserModel> {
        return this.prismaService.client.userModel.create({
            data: {
                email,
                password,
                name,
            },
        });
    }

    async find(email: string): Promise<UserModel | null> {
        return this.prismaService.client.userModel.findFirst({
            where: {
                email,
            },
        });
    }

    async delete(email: string): Promise<void> {
        await this.prismaService.client.userModel.deleteMany({
            where: {
                email: email,
            },
        });
    }
}
