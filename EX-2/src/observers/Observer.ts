import { Logger } from '../logger/Logger';

export interface Observer {
  update(message: string): void;
}

export class ConsoleObserver implements Observer {
  update(message: string): void {
    console.log(`\n[NOTIFICATION] ${message}\n`);
    void Logger.info(`[NOTIFY] ${message}`);
  }
}
