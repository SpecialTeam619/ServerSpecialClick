import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';
import { TYPES } from '../types';
import { UserService } from './users.service';
import { User } from './users.entity';
import { UserModel } from '../prisma/generated/client';
import { UserLoginDto } from './dto/login.dto';

const ConfigServiceMock: IConfigService = {
    get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
    find: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
};

const container = new Container();
let usersService: IUserService;
let configService: IConfigService;
let usersRepository: IUsersRepository;

beforeAll(() => {
    container.bind<IUserService>(TYPES.UserService).to(UserService);
    container
        .bind<IConfigService>(TYPES.ConfigService)
        .toConstantValue(ConfigServiceMock);
    container
        .bind<IUsersRepository>(TYPES.UsersRepository)
        .toConstantValue(UsersRepositoryMock);

    usersService = container.get<IUserService>(TYPES.UserService);
    configService = container.get<IConfigService>(TYPES.ConfigService);
    usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
});

let createdUser: UserModel | null;

describe('User Service', () => {
    it('createUser', async () => {
        configService.get = jest.fn().mockReturnValueOnce('1');
        usersRepository.create = jest.fn().mockImplementation(
            (user: User): UserModel => ({
                name: user.name,
                email: user.email,
                password: user.password,
                id: 1,
                createdAt: new Date(2025, 0, 15, 10, 30, 0),
                role: 'CUSTOMER',
            }),
        );
        createdUser = await usersService.createUser({
            email: 'alex@gmail.com',
            name: 'Alex',
            password: 'password',
        });
        expect(createdUser?.id).toEqual(1);
        expect(createdUser?.password).not.toEqual('password');
    });

    it('validateUser - correct password', async () => {
        if (!createdUser) return;

        configService.get = jest.fn().mockReturnValueOnce('1');
        usersRepository.find = jest
            .fn()
            .mockImplementation((email: string): UserModel | null => {
                if (!createdUser) return null;
                if (email === createdUser.email) {
                    return {
                        name: createdUser.name,
                        email: email,
                        password: createdUser.password,
                        id: 1,
                        createdAt: new Date(2025, 0, 15, 10, 30, 0),
                        role: 'CUSTOMER',
                    };
                } else {
                    return null;
                }
            });

        const validateUser: UserLoginDto = {
            email: createdUser.email,
            password: 'password',
        };
        const isValid = await usersService.validateUser(validateUser);

        expect(isValid).toBeTruthy();
    });

    it('validateUser - wrong password', async () => {
        if (!createdUser) return;

        configService.get = jest.fn().mockReturnValueOnce('1');
        usersRepository.find = jest
            .fn()
            .mockImplementation((email: string): UserModel | null => {
                if (!createdUser) return null;
                if (email === createdUser.email) {
                    return {
                        name: createdUser.name,
                        email: email,
                        password: createdUser.password,
                        id: 1,
                        createdAt: new Date(2025, 0, 15, 10, 30, 0),
                        role: 'CUSTOMER',
                    };
                } else {
                    return null;
                }
            });

        const validateUser: UserLoginDto = {
            email: createdUser.email,
            password: 'wrongpassword',
        };
        const isValid = await usersService.validateUser(validateUser);

        expect(isValid).toBeFalsy();
    });
});
