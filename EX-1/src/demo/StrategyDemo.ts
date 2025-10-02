// src/demo/StrategyDemo.ts - DETAILED EXPLANATION

import { Logger } from '../core/Logger';
import { 
  PaymentProcessor,
  CreditCardPaymentStrategy,
  PayPalPaymentStrategy,
  CryptocurrencyPaymentStrategy,
  PaymentDetails 
} from '../behavioral/strategy/PaymentProcessor';
import { ErrorHandler } from '../core/ErrorHandler';

/**
 * StrategyDemo Class - Demonstrates the Strategy Pattern
 * 
 * Purpose: Shows how different payment strategies can be used interchangeably
 * at runtime without changing the client code (PaymentProcessor)
 * 
 * Strategy Pattern Benefits Demonstrated:
 * 1. Runtime algorithm switching
 * 2. Open/Closed Principle - add new payment methods without modifying existing code
 * 3. Eliminates conditional statements for different behaviors
 * 4. Makes the code more maintainable and testable
 */
export class StrategyDemo {
  private logger: Logger;
  private errorHandler: ErrorHandler;

  constructor() {
    // Singleton pattern - get the same logger instance across the application
    this.logger = Logger.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
  }

  /**
   * Main demonstration method
   * Shows the Strategy pattern in action by:
   * 1. Processing payments with different strategies
   * 2. Switching strategies at runtime
   * 3. Handling different payment validation requirements
   */
  public async demonstrate(): Promise<void> {
    console.log('\n💳 Strategy Pattern Demo - Payment Processing');
    console.log('=============================================');

    // Create PaymentProcessor with initial CreditCard strategy
    const processor = new PaymentProcessor(new CreditCardPaymentStrategy());
    const amount = 99.99; // Same amount for all payments to show strategy differences

    // STRATEGY 1: Credit Card Payment
    console.log('\n1️⃣ Processing Credit Card Payment...');
    await this.processCreditCardPayment(processor, amount);

    await this.sleep(2000); // Pause for better user experience

    // STRATEGY 2: PayPal Payment - RUNTIME STRATEGY SWITCHING
    console.log('\n2️⃣ Switching to PayPal Payment...');
    processor.setStrategy(new PayPalPaymentStrategy()); // 🔄 Key Strategy Pattern Feature!
    await this.processPayPalPayment(processor, amount);

    await this.sleep(2000);

    // STRATEGY 3: Cryptocurrency Payment - ANOTHER RUNTIME SWITCH
    console.log('\n3️⃣ Switching to Cryptocurrency Payment...');
    processor.setStrategy(new CryptocurrencyPaymentStrategy()); // 🔄 Another switch!
    await this.processCryptocurrencyPayment(processor, amount);

    console.log('\n✅ Strategy Pattern Demo completed!');
    console.log('🎯 Notice how the PaymentProcessor remained unchanged');
    console.log('   while we switched between different payment algorithms!');
  }

  /**
   * Demonstrates Credit Card Payment Strategy
   * 
   * Key Points:
   * - Each strategy has different validation requirements
   * - Same PaymentProcessor.processPayment() method is called
   * - Strategy handles the specific implementation details
   */
  private async processCreditCardPayment(processor: PaymentProcessor, amount: number): Promise<void> {
    // Credit Card specific payment details
    const creditCardDetails: PaymentDetails = {
      customerEmail: 'customer@example.com',
      // Credit card specific fields
      cardNumber: '4532-1234-5678-9012',
      expiryDate: '12/25',
      cvv: '123',
      billingAddress: '123 Main St, City, State'
    };

    try {
      // 🔑 STRATEGY PATTERN IN ACTION:
      // The processor doesn't know which strategy it's using
      // It just calls processPayment() and the strategy handles the rest
      const result = await processor.processPayment(amount, creditCardDetails);
      
      console.log(`✅ ${result.message}`);
      console.log(`   Transaction ID: ${result.transactionId}`);
      console.log(`   Processed at: ${result.timestamp.toLocaleString()}`);
      console.log(`   🔍 Credit Card Strategy: Validated card number, expiry, CVV`);
    } catch (error) {
      this.errorHandler.handleError(error, 'CreditCardPayment');
    }
  }

  /**
   * Demonstrates PayPal Payment Strategy
   * 
   * Key Points:
   * - Different validation logic (PayPal email instead of card details)
   * - Different processing time simulation
   * - Same interface, different implementation
   */
  private async processPayPalPayment(processor: PaymentProcessor, amount: number): Promise<void> {
    // PayPal specific payment details - notice different required fields
    const paypalDetails: PaymentDetails = {
      customerEmail: 'customer@example.com',
      // PayPal specific fields
      paypalEmail: 'customer@paypal.com',
      billingAddress: '123 Main St, City, State'
      // No card details needed!
    };

    try {
      // 🔑 SAME METHOD CALL, DIFFERENT STRATEGY EXECUTION
      const result = await processor.processPayment(amount, paypalDetails);
      
      console.log(`✅ ${result.message}`);
      console.log(`   Transaction ID: ${result.transactionId}`);
      console.log(`   Processed at: ${result.timestamp.toLocaleString()}`);
      console.log(`   🔍 PayPal Strategy: Validated PayPal account, faster processing`);
    } catch (error) {
      this.errorHandler.handleError(error, 'PayPalPayment');
    }
  }

  /**
   * Demonstrates Cryptocurrency Payment Strategy
   * 
   * Key Points:
   * - Most complex validation (wallet address, private key)
   * - Longest processing time (blockchain simulation)
   * - Demonstrates how strategies can have vastly different implementations
   */
  private async processCryptocurrencyPayment(processor: PaymentProcessor, amount: number): Promise<void> {
    // Cryptocurrency specific payment details
    const cryptoDetails: PaymentDetails = {
      customerEmail: 'customer@example.com',
      // Cryptocurrency specific fields
      walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      privateKey: 'encrypted-private-key-hash',
      cryptocurrency: 'Bitcoin'
      // Completely different validation requirements!
    };

    try {
      // 🔑 SAME INTERFACE, MOST COMPLEX IMPLEMENTATION
      const result = await processor.processPayment(amount, cryptoDetails);
      
      console.log(`✅ ${result.message}`);
      console.log(`   Transaction ID: ${result.transactionId}`);
      console.log(`   Processed at: ${result.timestamp.toLocaleString()}`);
      console.log(`   🔍 Crypto Strategy: Validated wallet, blockchain processing (slowest)`);
    } catch (error) {
      this.errorHandler.handleError(error, 'CryptocurrencyPayment');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * 🎯 STRATEGY PATTERN ANALYSIS:
 * 
 * What makes this a Strategy Pattern implementation?
 * 
 * 1. CONTEXT (PaymentProcessor):
 *    - Maintains reference to a strategy object
 *    - Delegates work to the strategy
 *    - Allows runtime strategy switching
 * 
 * 2. STRATEGY INTERFACE (PaymentStrategy):
 *    - Defines common interface for all strategies
 *    - processPayment() and validatePaymentDetails() methods
 * 
 * 3. CONCRETE STRATEGIES:
 *    - CreditCardPaymentStrategy
 *    - PayPalPaymentStrategy  
 *    - CryptocurrencyPaymentStrategy
 *    - Each implements the interface differently
 * 
 * 4. CLIENT (StrategyDemo):
 *    - Uses the context without knowing which strategy is active
 *    - Can switch strategies at runtime
 * 
 * 🚀 BENEFITS DEMONSTRATED:
 * 
 * ✅ Runtime Flexibility: Switch payment methods without restarting
 * ✅ Open/Closed Principle: Add new payment methods without changing existing code
 * ✅ Single Responsibility: Each strategy handles one payment type
 * ✅ Testability: Each strategy can be tested independently
 * ✅ Maintainability: Changes to one payment method don't affect others
 * 
 * 🔧 REAL-WORLD APPLICATIONS:
 * 
 * - E-commerce payment gateways
 * - Sorting algorithms (QuickSort, MergeSort, BubbleSort)
 * - Compression algorithms (ZIP, RAR, 7Z)
 * - Database connection strategies (MySQL, PostgreSQL, MongoDB)
 * - Authentication methods (OAuth, LDAP, JWT)
 * - Pricing strategies (Regular, Discount, Premium)
 * 
 * 📊 EXECUTION FLOW:
 * 
 * 1. StrategyDemo creates PaymentProcessor with CreditCardStrategy
 * 2. Calls processor.processPayment() → CreditCardStrategy.processPayment()
 * 3. StrategyDemo calls processor.setStrategy(PayPalStrategy)
 * 4. Calls processor.processPayment() → PayPalStrategy.processPayment()
 * 5. StrategyDemo calls processor.setStrategy(CryptocurrencyStrategy)
 * 6. Calls processor.processPayment() → CryptocurrencyStrategy.processPayment()
 * 
 * Notice: PaymentProcessor code never changes, only the strategy implementations!
 */

/**
 * 🛠️ HOW TO EXTEND THIS PATTERN:
 * 
 * To add a new payment method (e.g., Apple Pay):
 * 
 * 1. Create ApplePayPaymentStrategy class
 * 2. Implement PaymentStrategy interface
 * 3. Add specific validation logic
 * 4. Use it: processor.setStrategy(new ApplePayPaymentStrategy())
 * 
 * NO CHANGES needed to:
 * - PaymentProcessor class
 * - Other strategy implementations
 * - Client code (except to use the new strategy)
 * 
 * This is the power of the Strategy Pattern! 🎯
 */