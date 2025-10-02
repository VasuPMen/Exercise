import { Logger } from './Logger';

export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handleError(error: unknown, context: string = 'Unknown'): void {
    if (error instanceof ApplicationError) {
      this.logger.error(`Application Error in ${context}: ${error.message} [Code: ${error.code}]`, error);
      if (error.isRetryable) {
        this.logger.info('This error is retryable. Consider implementing retry logic.');
      }
    } else if (error instanceof Error) {
      this.logger.error(`Unexpected Error in ${context}: ${error.message}`, error);
    } else {
      this.logger.error(`Unknown Error in ${context}: ${String(error)}`);
    }
  }

  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (error instanceof ApplicationError && !error.isRetryable) {
          throw error;
        }
        
        if (attempt === maxRetries) {
          break;
        }
        
        this.logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await this.sleep(delay);
        delay *= 2; // Exponential backoff
      }
    }
    
    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}