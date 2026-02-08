import { PostModel } from '../prisma/generated/client';
import { Post } from './posts.entity';


export interface IPostsRepository {
    create: (post: Post) => Promise<PostModel>;
    // find: (title: string) => Promise<UserModel | null>;
    // delete: (title: string) => Promise<void>;
}
