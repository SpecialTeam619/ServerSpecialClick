import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './users.interface';
import { UserService } from './users.service';
import { UserLoginDto } from './dto/login.dto';
import { UserRegisterDto } from './dto/register.dto';
import { sign } from 'jsonwebtoken';
import { validateMiddleware } from '../common/validate.middleware';
import { GuardMiddleware } from '../common/guard.middleware';
import { IConfigService } from '../config/config.service.interface';
import { MulterMiddleware } from '../common/multer.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UserService) private UserService: UserService,
        @inject(TYPES.ConfigService) private configService: IConfigService,
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [
                    new MulterMiddleware(),
                    new validateMiddleware(UserRegisterDto),
                ],
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new validateMiddleware(UserLoginDto)],
            },
            {
                path: '/delete',
                method: 'delete',
                func: this.delete,
            },
            {
                path: '/info',
                method: 'get',
                func: this.info,
                middlewares: [new GuardMiddleware()],
            },
        ]);
    }

    async login(
        { body }: Request<{}, {}, UserLoginDto>,
        res: Response,
        next: NextFunction,
    ) {
        const result = await this.UserService.validateUser(body);
        if (!result) {
            return next(
                new HTTPError(401, 'Неверная почта или пароль', 'login'),
            );
        }
        const jwt = await this.singJWT(
            body.email,
            this.configService.get('SECRET'),
        );
        this.ok(res, { jwt });
    }

    async delete(
        { body }: Request<{}, {}, UserLoginDto>,
        res: Response,
        next: NextFunction,
    ) {
        const result = await this.UserService.delete(body);
        if (!result) {
            return next(
                new HTTPError(401, 'Неверная почта или пароль', 'delete'),
            );
        }

        this.ok(res, 'Пользователь успешно удален');
    }

    async register(
        { body, file }: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const result = await this.UserService.createUser(body, file);
        if (!result) {
            return next(
                new HTTPError(422, 'Такой пользователь уже существует'),
            );
        }
        this.created(res);
    }

    async info(
        { user }: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ) {
        if (!user) return next();
        const userInfo = await this.UserService.getUserInfo(user);
        if (!userInfo)
            return next(new HTTPError(404, 'Пользователь не найден'));
        this.ok(res, { email: userInfo.email });
    }

    private singJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    email,
                    iat: Math.floor(Date.now() / 1000),
                },
                secret,
                {
                    algorithm: 'HS256',
                },
                (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(token as string);
                },
            );
        });
    }
}
