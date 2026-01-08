import { UserModel } from '../prisma/generated/client';
import { UserLoginDto } from './dto/login.dto';
import { UserRegisterDto } from './dto/register.dto';

export interface IUserService {
    createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
    validateUser: (dto: UserLoginDto) => Promise<boolean>;
    delete: (dto: UserLoginDto) => Promise<boolean>;
    getUserInfo(email: string): Promise<UserModel | null>;
}
