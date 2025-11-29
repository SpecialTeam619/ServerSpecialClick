import { injectable } from 'inversify';
import { ILogger } from './logger.interface';

@injectable()
export class LoggerService implements ILogger {
    log(...args: unknown[]) {
        console.log(
            '\x1b[34m' + '\x1b[1m' + '[LOG]' + '\x1b[1m' + '\x1b[0m',
            ...args,
        );
    }

    error(...args: unknown[]) {
        console.error(
            '\x1b[31m' + '\x1b[1m' + '[ERROR]' + '\x1b[1m' + '\x1b[0m',
            ...args,
        );
    }

    warn(...args: unknown[]) {
        console.warn(
            '\x1b[33m' + '\x1b[1m' + '[WARN]' + '\x1b[1m' + '\x1b[0m',
            ...args,
        );
    }
}
