// import { UserModel } from "../generated/prisma";
import { UserLoginDto } from './dto/login.dto';
import { UserRegisterDto } from './dto/register.dto';
import { User } from './users.entity';

export interface IUserService {
    createUser: (dto: UserRegisterDto) => Promise<User | null>;
    validateUser: (dto: UserLoginDto) => Promise<boolean>;
    delete: (dto: UserLoginDto) => Promise<boolean>;
    getUserInfo(email: string): Promise<User | null>;
}
