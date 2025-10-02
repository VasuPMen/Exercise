export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public debug(message: string, context?: any): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`, context || '');
    }
  }

  public info(message: string, context?: any): void {
    if (this.logLevel <= LogLevel.INFO) {
      console.log(`[INFO] ${new Date().toISOString()}: ${message}`, context || '');
    }
  }

  public warn(message: string, context?: any): void {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, context || '');
    }
  }

  public error(message: string, error?: Error): void {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error?.stack || '');
    }
  }
}