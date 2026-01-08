import { UserModel } from '../prisma/generated/client';
import { User } from './users.entity';

export interface IUsersRepository {
    create: (user: User) => Promise<UserModel>;
    find: (email: string) => Promise<UserModel | null>;
    delete: (email: string) => Promise<void>;
}
