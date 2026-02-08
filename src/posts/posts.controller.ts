import { inject, injectable } from 'inversify';
import { GuardMiddleware } from '../common/guard.middleware';
import { MulterMiddleware } from '../common/multer.middleware';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { BaseController } from '../common/base.controller';
import { IPostsController } from './posts.interface';
import { CreatePostDto } from './dto/create.dto';
import { NextFunction, Request, Response } from 'express';
import { IPostsService } from './posts.service.interfact';
import { validateMiddleware } from '../common/validate.middleware';
import { AuthMiddleware } from '../common/auth.middleware';

@injectable()
export class PostsController
    extends BaseController
    implements IPostsController
{
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PostsService) private postService: IPostsService,
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: '/create',
                method: 'post',
                func: this.create,
                middlewares: [
                    new validateMiddleware(CreatePostDto),
                    new GuardMiddleware(),
                ],
            },
        ]);
    }

    async create(
        req: Request<{}, {}, CreatePostDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        if (!req.user) return next();
        const post = await this.postService.createPost({
            ...req.body,
            authorEmail: req.user,
        });
        this.ok(res, post);
    }

    async info(
        req: Request<{}, {}, CreatePostDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        this.ok(res, 'Информация о посте');
    }

    async delete(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        this.ok(res, 'Пост успешно удалён');
    }
}
