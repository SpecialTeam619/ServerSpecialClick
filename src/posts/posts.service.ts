import { TYPES } from '../types';
import { injectable, inject } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { IPostsService } from './posts.service.interfact';
import { CreatePostDto } from './dto/create.dto';
import { Post } from './posts.entity';
import { IPostsRepository } from './posts.repository.interface';
import { IUsersRepository } from '../users/users.repository.interface';
import { PostModel } from '../prisma/generated/client';

@injectable()
export class PostsService implements IPostsService {
    constructor(
        @inject(TYPES.ConfigService) private configServie: IConfigService,
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.PostsRepository) private postsRepository: IPostsRepository,
        @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
    ) {}
    async createPost(dto: CreatePostDto): Promise<PostModel | null> {
        this.loggerService.log(`Creating post with title: ${dto.title}`);

        const author = await this.usersRepository.find(dto.authorEmail);
        if (!author) {
            this.loggerService.log(`Author with email ${dto.authorEmail} not found`);
            return null;
        }
        
        const newPost = new Post(dto.title, dto.description, dto.price, dto.properties, author.id);

        return await this.postsRepository.create(newPost);
    }
}
