import { Logger } from '../../core/Logger';
import { ApplicationError } from '../../core/ErrorHandler';
import { Validator } from '../../core/Validator';

export interface PaymentStrategy {
  processPayment(amount: number, details: PaymentDetails): Promise<PaymentResult>;
  validatePaymentDetails(details: PaymentDetails): boolean;
}

export interface PaymentDetails {
  customerEmail: string;
  billingAddress?: string;
  [key: string]: any;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: Date;
}

export class CreditCardPaymentStrategy implements PaymentStrategy {
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  public async processPayment(amount: number, details: PaymentDetails): Promise<PaymentResult> {
    Validator.isPositiveNumber(amount, 'Payment amount');
    
    if (!this.validatePaymentDetails(details)) {
      throw new ApplicationError('Invalid credit card details', 'PAYMENT_VALIDATION_ERROR');
    }

    this.logger.info(`Processing credit card payment of $${amount}`);
    
    // Simulate payment processing
    await this.simulateNetworkCall();
    
    const transactionId = `CC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      transactionId,
      message: 'Credit card payment processed successfully',
      timestamp: new Date()
    };
  }

  public validatePaymentDetails(details: PaymentDetails): boolean {
    return !!(details.cardNumber && details.expiryDate && details.cvv && 
              Validator.isValidEmail(details.customerEmail));
  }

  private async simulateNetworkCall(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  }
}

export class PayPalPaymentStrategy implements PaymentStrategy {
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  public async processPayment(amount: number, details: PaymentDetails): Promise<PaymentResult> {
    Validator.isPositiveNumber(amount, 'Payment amount');
    
    if (!this.validatePaymentDetails(details)) {
      throw new ApplicationError('Invalid PayPal details', 'PAYMENT_VALIDATION_ERROR');
    }

    this.logger.info(`Processing PayPal payment of $${amount}`);
    
    await this.simulateNetworkCall();
    
    const transactionId = `PP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      transactionId,
      message: 'PayPal payment processed successfully',
      timestamp: new Date()
    };
  }

  public validatePaymentDetails(details: PaymentDetails): boolean {
    return !!(details.paypalEmail && Validator.isValidEmail(details.paypalEmail) &&
              Validator.isValidEmail(details.customerEmail));
  }

  private async simulateNetworkCall(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 300));
  }
}

export class CryptocurrencyPaymentStrategy implements PaymentStrategy {
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  public async processPayment(amount: number, details: PaymentDetails): Promise<PaymentResult> {
    Validator.isPositiveNumber(amount, 'Payment amount');
    
    if (!this.validatePaymentDetails(details)) {
      throw new ApplicationError('Invalid cryptocurrency details', 'PAYMENT_VALIDATION_ERROR');
    }

    this.logger.info(`Processing cryptocurrency payment of $${amount}`);
    
    await this.simulateNetworkCall();
    
    const transactionId = `CRYPTO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      transactionId,
      message: 'Cryptocurrency payment processed successfully',
      timestamp: new Date()
    };
  }

  public validatePaymentDetails(details: PaymentDetails): boolean {
    return !!(details.walletAddress && details.privateKey && 
              Validator.isValidEmail(details.customerEmail));
  }

  private async simulateNetworkCall(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  }
}

export class PaymentProcessor {
  private strategy: PaymentStrategy;
  private logger: Logger;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
    this.logger = Logger.getInstance();
  }

  public setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
    this.logger.info('Payment strategy changed');
  }

  public async processPayment(amount: number, details: PaymentDetails): Promise<PaymentResult> {
    try {
      this.logger.info('Starting payment processing...');
      const result = await this.strategy.processPayment(amount, details);
      this.logger.info(`Payment processing completed: ${result.message}`);
      return result;
    } catch (error) {
      this.logger.error('Payment processing failed', error as Error);
      throw error;
    }
  }
}