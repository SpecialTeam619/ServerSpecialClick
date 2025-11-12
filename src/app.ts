import express, { Express } from "express";
import { Server } from "http";

export class App {
    app: Express;
    port: number;
    server: Server;

    constructor() {
        this.app = express();
        this.port = 8000
    }

    public async init() {
        this.server = this.app.listen(this.port);
        console.log(`Server is runner on "http://localhost:${this.port}"`)
    }
}