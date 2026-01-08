import { inject, injectable } from "inversify";
import { IConfigService } from "./config.service.interface";
import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    const result: DotenvConfigOutput = config();
    if (result.error) {
        this.logger.error("[ConfigService] Не удалось прочитать файл .env или он отсуствует");
    } else {
        this.logger.log("[ConfigService] Конфигурация .env загруженна");
        this.config = result.parsed as DotenvParseOutput;
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
