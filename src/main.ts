import { Container, ContainerModule, ContainerModuleLoadOptions } from "inversify"
import { App } from "./app"
import { ILogger } from "./logger/logger.interface"
import { TYPES } from "./types"
import { LoggerService } from "./logger/logger.service"

export const appBindings = new ContainerModule(
    (options: ContainerModuleLoadOptions) => {
        options.bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
        options.bind<App>(TYPES.Application).to(App)
    }
)

async function bootstrap() {
    const appContainer = new Container();
    appContainer.load(appBindings)
    const app = appContainer.get<App>(TYPES.Application)
    app.init()
    return { app }
}

export const boot = bootstrap()