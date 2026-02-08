import 'dotenv/config';
import {
    Container,
    ContainerModule,
    ContainerModuleLoadOptions,
} from 'inversify';
import { App } from './app';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { LoggerService } from './logger/logger.service';
import { IExeptionFilter } from './errors/exptions.filter.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { IUserController } from './users/users.interface';
import { UserController } from './users/users.controller';
import { IUserService } from './users/users.service.interface';
import { UserService } from './users/users.service';
import { IPrismaService } from './database/prisma.interface';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';
import { IPostsController } from './posts/posts.interface';
import { IPostsService } from './posts/posts.service.interfact';
import { IPostsRepository } from './posts/posts.repository.interface';
import { PostsRepository } from './posts/posts.repository';

export const appBindings = new ContainerModule(
    (options: ContainerModuleLoadOptions) => {
        options
            .bind<ILogger>(TYPES.ILogger)
            .to(LoggerService)
            .inSingletonScope();
        options
            .bind<IExeptionFilter>(TYPES.ExceptionFilter)
            .to(ExeptionFilter)
            .inSingletonScope();
        options
            .bind<IUserController>(TYPES.UserController)
            .to(UserController)
            .inSingletonScope();
        options
            .bind<IConfigService>(TYPES.ConfigService)
            .to(ConfigService)
            .inSingletonScope();
        options
            .bind<IUserService>(TYPES.UserService)
            .to(UserService)
            .inSingletonScope();
        options.bind<IPrismaService>(TYPES.PrismaService).to(PrismaService);
        options
            .bind<IUsersRepository>(TYPES.UsersRepository)
            .to(UsersRepository);
        options.bind<IPostsService>(TYPES.PostsService).to(PostsService);
        options
            .bind<IPostsController>(TYPES.PostsController)
            .to(PostsController);
        options
            .bind<IPostsRepository>(TYPES.PostsRepository)
            .to(PostsRepository);
        options.bind<App>(TYPES.Application).to(App);
    },
);

async function bootstrap() {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();
    return { app };
}

export const boot = bootstrap();
