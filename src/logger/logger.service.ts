import { ILogObj, Logger } from 'tslog'
import { injectable } from 'inversify';
import { ILogger } from './logger.interface';

@injectable()
export class LoggerService implements ILogger {
    public logger: Logger<ILogObj>;
    
    constructor() {
        this.logger = new Logger({
            prettyLogTemplate: "{{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t",
        })
    }

    log(...args: unknown[]) {
        this.logger.info(...args)
    }
    
    error(...args: unknown[]) {
        this.logger.info(...args)
    }

    warn(...args: unknown[]) {
        this.logger.info(...args)
    }
}