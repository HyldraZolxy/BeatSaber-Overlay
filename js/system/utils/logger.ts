type LogLevel =  'debug' | 'info' | 'warn' | 'error';

export class LoggerService {
    private logLevel: LogLevel;

    constructor(logLevel: LogLevel = 'info') {
        this.logLevel = logLevel;
    }

    setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    info(message: string, ...optionalParams: any[]): void {
        if (this.shouldLog('info')) console.log(`[INFO]: ${message}`, ...optionalParams);
    }

    warn(message: string, ...optionalParams: any[]): void {
        if (this.shouldLog('warn')) console.warn(`[WARN]: ${message}`, ...optionalParams);
    }

    error(message: string, ...optionalParams: any[]): void {
        if (this.shouldLog('error')) console.error(`[ERROR]: ${message}`, ...optionalParams);
    }

    debug(message: string, ...optionalParams: any[]): void {
        if (this.shouldLog('debug')) console.debug(`[DEBUG]: ${message}`, ...optionalParams);
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: Record<LogLevel, number> = {
            debug: 0,
            info : 1,
            warn : 2,
            error: 3,
        };

        return levels[level] >= levels[this.logLevel];
    }
}
