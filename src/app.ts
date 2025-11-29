import express, { Express } from "express";
import { Server } from "http";
import { inject } from "inversify";
import { TYPES } from "./types";
import { ILogger } from "./logger/logger.interface";

export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger
    ) {
        this.app = express();
        this.port = 8000
    }

    public async init() {
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is runner on "http://localhost:${this.port}"`)
    }
}