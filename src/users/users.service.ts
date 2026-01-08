import { compare } from 'bcryptjs';
import { UserModel } from '../prisma/generated/client';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/login.dto';
import { UserRegisterDto } from './dto/register.dto';
import { User } from './users.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';
import { injectable, inject } from 'inversify';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.ConfigService) private configServie: IConfigService,
        @inject(TYPES.UsersRepository)
        private usersRepository: IUsersRepository,
    ) {}

    async createUser({
        name,
        email,
        password,
    }: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(email, name);
        const salt = this.configServie.get('SALT');

        await newUser.setPassword(password, Number(salt));
        const existedUser = await this.usersRepository.find(email);
        if (existedUser) {
            return null;
        }
        return this.usersRepository.create(newUser);
    }

    async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
        const existedUser = await this.usersRepository.find(email);
        if (!existedUser) {
            return false;
        }

        const chekedPassword = await compare(password, existedUser.password);

        return chekedPassword;
    }

    async getUserInfo(email: string): Promise<UserModel | null> {
        return this.usersRepository.find(email);
    }

    async delete(user: UserLoginDto): Promise<boolean> {
        const validate = await this.validateUser(user);

        if (!validate) return false;
        await this.usersRepository.delete(user.email);
        return true;
    }
}
