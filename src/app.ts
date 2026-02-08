import express, { Express, json } from 'express';
import { Server } from 'http';
import { inject } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exptions.filter.interface';
import { UserController } from './users/users.controller';
import { IPrismaService } from './database/prisma.interface';
import { AuthMiddleware } from './common/auth.middleware';
import { IConfigService } from './config/config.service.interface';
import { PostsController } from './posts/posts.controller';

export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.ExceptionFilter) private exeptionFilter: IExeptionFilter,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.PrismaService) private prismaService: IPrismaService,
        @inject(TYPES.PostsController) private postsController: PostsController,
    ) {
        this.app = express();
        this.port = 8000;
    }

    useMiddleware(): void {
        this.app.use(json());
        const authMiddleware = new AuthMiddleware(
            this.configService.get('SECRET'),
        );
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    useRoutes() {
        this.app.use('/users', this.userController.router);
        this.app.use('/posts', this.postsController.router);
    }

    useExeptionFilters() {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }

    public async init() {
        await this.prismaService.connect();
        this.useMiddleware();
        this.useRoutes();
        this.useExeptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is runner on "http://localhost:${this.port}"`);
    }

    public close(): void {
        this.server.close();
    }
}
