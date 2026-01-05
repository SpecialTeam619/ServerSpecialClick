import { TYPES } from '../types';
import { UserLoginDto } from './dto/login.dto';
import { UserRegisterDto } from './dto/register.dto';
import { User } from './users.entity';
import { IUserService } from './users.service.interface';
import { injectable, inject } from 'inversify';

@injectable()
export class UserService implements IUserService {
    constructor() {}

    async createUser({
        name,
        email,
        password,
    }: UserRegisterDto): Promise<User | null> {
        const newUser = new User(email, name);

        return newUser;
    }

    async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
        return false;
    }

    async getUserInfo(email: string): Promise<User | null> {
        return null;
    }

    async delete(user: UserLoginDto): Promise<boolean> {
        return false;
    }
}
