import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';
import { Post } from './posts.entity';
import { IPostsRepository } from './posts.repository.interface';
import { PostModel } from '../prisma/generated/client';

@injectable()
export class PostsRepository implements IPostsRepository {
    constructor(
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {}

    async create({ title, description, price, properties, authorId }: Post ): Promise<PostModel> {
        return this.prismaService.client.postModel.create({
            data: {
                authorId,
                title,
                description,
                price,
                properties,
            },
        });
    }

    // async find(title: string): Promise<PostModel | null> {
    //     return this.prismaService.client.postModel.findFirst({
    //         where: {
    //             title,
    //         },
    //     });
    // }

    // async delete(title: string): Promise<void> {
    //     await this.prismaService.client.postModel.deleteMany({
    //         where: {
    //             title: title,
    //         },
    //     });
    // }
}
