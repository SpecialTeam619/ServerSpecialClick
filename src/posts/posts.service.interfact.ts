import { PostModel } from '../prisma/generated/client';
import { CreatePostDto } from './dto/create.dto';

export interface IPostsService {
    createPost: (dto: CreatePostDto) => Promise<PostModel | null>;
    // getPostInfo(email: string): Promise<Post | null>;
    // delete: (dto: UserLoginDto) => Promise<boolean>;
}
