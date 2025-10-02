// src/services/MenuService.ts
import { Logger } from '../core/Logger';
import { ErrorHandler, ApplicationError } from '../core/ErrorHandler';

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  action: () => Promise<void>;
}

export class MenuService {
  private currentMenu: MenuItem[] = [];
  private isRunning: boolean = false;
  private logger: Logger;
  private errorHandler: ErrorHandler;

  constructor() {
    this.logger = Logger.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public setMenu(items: MenuItem[]): void {
    this.currentMenu = items;
    this.logger.info(`Menu updated with ${items.length} items`);
  }

  public async start(): Promise<void> {
    this.isRunning = true;
    this.logger.info('Menu service started');

    while (this.isRunning) {
      try {
        await this.displayMenuAndWaitForInput();
      } catch (error) {
        this.errorHandler.handleError(error, 'MenuService.start');
        
        // If it's a critical error, break the loop
        if (error instanceof ApplicationError && !error.isRetryable) {
          this.logger.error('Critical error encountered, stopping menu service');
          break;
        }
        
        // For other errors, continue running
        await this.sleep(1000);
      }
    }
  }

  public stop(): void {
    this.isRunning = false;
    this.logger.info('Menu service stopped');
  }

  private async displayMenuAndWaitForInput(): Promise<void> {
    console.log('\n' + '='.repeat(50));
    console.log('Design Patterns Demo - Main Menu');
    console.log('='.repeat(50));

    this.currentMenu.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   ${item.description}`);
      console.log('');
    });

    console.log('0. Exit');
    console.log('='.repeat(50));

    const choice = await this.getUserInput('Please select an option: ');
    await this.handleUserChoice(choice);
  }

  private async handleUserChoice(choice: string): Promise<void> {
    const choiceNum = parseInt(choice.trim());

    if (choiceNum === 0) {
      console.log('Thank you for using the Design Patterns Demo!');
      this.stop();
      return;
    }

    if (isNaN(choiceNum) || choiceNum < 1 || choiceNum > this.currentMenu.length) {
      console.log('Invalid choice. Please try again.');
      await this.sleep(1500);
      return;
    }

    const selectedItem = this.currentMenu[choiceNum - 1];
    this.logger.info(`User selected: ${selectedItem.title}`);

    try {
      await selectedItem.action();
    } catch (error) {
      this.errorHandler.handleError(error, `MenuItem.${selectedItem.id}`);
      console.log('\nAn error occurred. Please try again.');
    }

    await this.waitForUserToContinue();
  }

  private async getUserInput(prompt: string): Promise<string> {
    // In a real implementation, you would use readline-sync or similar
    // For this demo, we'll simulate user input
    process.stdout.write(prompt);
    
    return new Promise((resolve) => {
      const stdin = process.stdin;
      stdin.setEncoding('utf8');
      stdin.setRawMode(false);
      stdin.resume();
      
      const onData = (data: string) => {
        stdin.removeListener('data', onData);
        stdin.pause();
        resolve(data.toString().trim());
      };
      
      stdin.on('data', onData);
    });
  }

  private async waitForUserToContinue(): Promise<void> {
    console.log('\nPress Enter to continue...');
    await this.getUserInput('');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}