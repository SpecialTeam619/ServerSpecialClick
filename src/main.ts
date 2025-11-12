import { App } from "./app"

async function bootstrap() {
    const app = new App()
    app.init()
    return { app }
}

export const boot = bootstrap()