import express, { Express, json } from 'express';
import { Server } from 'http';
import { inject } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exptions.filter.interface';
import { UserController } from './users/users.controller';

export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.ExceptionFilter) private exeptionFilter: IExeptionFilter,
        @inject(TYPES.UserController) private userController: UserController,
    ) {
        this.app = express();
        this.port = 8000;
    }

    useMiddleware(): void {
        this.app.use(json());
    }

    useRoutes() {
        this.app.use("/users", this.userController.router)
    }

    useExeptionFilters() {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }

    public async init() {
        this.useMiddleware();
        this.useRoutes()
        this.useExeptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is runner on "http://localhost:${this.port}"`);
    }
}
