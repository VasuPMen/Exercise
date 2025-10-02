import { Logger } from '../core/Logger';
import { 
  CoffeeShop,
  Espresso,
  Americano,
  MilkDecorator,
  SugarDecorator,
  VanillaSyrupDecorator,
  WhippedCreamDecorator,
  ExtraShotDecorator,
  Coffee 
} from '../structural/decorator/CoffeeShop';
import { ErrorHandler } from '../core/ErrorHandler';
import { ReportBuilder } from '../creational/builder/ReportBuilder';

export class DecoratorDemo {
  private logger: Logger;
  private errorHandler: ErrorHandler;
  private coffeeShop: CoffeeShop;

  constructor() {
    this.logger = Logger.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.coffeeShop = new CoffeeShop("Claude's Coffee Corner");
  }

  public async demonstrate(): Promise<void> {
    console.log('\n☕ Decorator Pattern Demo - Coffee Shop Customization');
    console.log('====================================================');

    // Create different coffee orders with decorators
    await this.createSimpleCoffeeOrder();
    await this.sleep(1500);
    
    await this.createComplexCoffeeOrder();
    await this.sleep(1500);
    
    await this.createExtremeCoffeeOrder();
    await this.sleep(1500);
    
    await this.showOrderSummary();

    console.log('\n✅ Decorator Pattern Demo completed!');
  }

  private async createSimpleCoffeeOrder(): Promise<void> {
    console.log('\n☕ Creating Simple Coffee Order...');
    
    try {
      // Basic espresso with milk
      let coffee: Coffee = new Espresso();
      coffee = new MilkDecorator(coffee, 'Oat milk');
      
      const order = this.coffeeShop.createOrder(coffee, 'Alice Johnson');
      
      console.log('✅ Simple Coffee Order Created:');
      console.log(`   🏷️ Order ID: ${order.id}`);
      console.log(`   👤 Customer: ${order.customerName}`);
      console.log(`   ☕ Coffee: ${coffee.getDescription()}`);
      console.log(`   🍃 Ingredients: ${coffee.getIngredients().join(', ')}`);
      console.log(`   🔥 Calories: ${coffee.getCalories()}`);
      console.log(`   💰 Price: ${coffee.getPrice().toFixed(2)}`);
      
    } catch (error) {
      this.errorHandler.handleError(error, 'SimpleCoffeeOrder');
    }
  }

  private async createComplexCoffeeOrder(): Promise<void> {
    console.log('\n☕ Creating Complex Coffee Order...');
    
    try {
      // Americano with multiple decorators
      let coffee: Coffee = new Americano();
      coffee = new MilkDecorator(coffee, 'Almond milk');
      coffee = new SugarDecorator(coffee, 2);
      coffee = new VanillaSyrupDecorator(coffee, 1);
      
      const order = this.coffeeShop.createOrder(coffee, 'Bob Smith');
      
      console.log('✅ Complex Coffee Order Created:');
      console.log(`   🏷️ Order ID: ${order.id}`);
      console.log(`   👤 Customer: ${order.customerName}`);
      console.log(`   ☕ Coffee: ${coffee.getDescription()}`);
      console.log(`   🍃 Ingredients: ${coffee.getIngredients().join(', ')}`);
      console.log(`   🔥 Calories: ${coffee.getCalories()}`);
      console.log(`   💰 Price: ${coffee.getPrice().toFixed(2)}`);
      
    } catch (error) {
      this.errorHandler.handleError(error, 'ComplexCoffeeOrder');
    }
  }

  private async createExtremeCoffeeOrder(): Promise<void> {
    console.log('\n☕ Creating Extreme Coffee Order (All Decorators)...');
    
    try {
      // Espresso with all possible decorators
      let coffee: Coffee = new Espresso();
      coffee = new ExtraShotDecorator(coffee, 2);
      coffee = new MilkDecorator(coffee, 'Whole milk');
      coffee = new VanillaSyrupDecorator(coffee, 2);
      coffee = new SugarDecorator(coffee, 3);
      coffee = new WhippedCreamDecorator(coffee);
      
      const order = this.coffeeShop.createOrder(coffee, 'Charlie Brown');
      
      console.log('✅ Extreme Coffee Order Created:');
      console.log(`   🏷️ Order ID: ${order.id}`);
      console.log(`   👤 Customer: ${order.customerName}`);
      console.log(`   ☕ Coffee: ${coffee.getDescription()}`);
      console.log(`   🍃 Ingredients: ${coffee.getIngredients().join(', ')}`);
      console.log(`   🔥 Calories: ${coffee.getCalories()}`);
      console.log(`   💰 Price: ${coffee.getPrice().toFixed(2)}`);
      
      // Print receipt for this order
      console.log('\n📄 Receipt:');
      console.log(this.coffeeShop.printReceipt(order));
      
    } catch (error) {
      this.errorHandler.handleError(error, 'ExtremeCoffeeOrder');
    }
  }

  private async showOrderSummary(): Promise<void> {
    console.log('\n📊 Coffee Shop Order Summary:');
    
    const orders = this.coffeeShop.getOrderHistory();
    const totalRevenue = this.coffeeShop.getTotalRevenue();
    
    console.log(`   📝 Total Orders: ${orders.length}`);
    console.log(`   💰 Total Revenue: ${totalRevenue.toFixed(2)}`);
    console.log(`   💵 Average Order Value: ${(totalRevenue / orders.length).toFixed(2)}`);
    
    console.log('\n📋 Order Details:');
    orders.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.customerName}: ${order.coffee.getDescription()} - ${order.totalPrice.toFixed(2)}`);
    });
    
    console.log('\n🎯 Decorator Pattern Benefits Demonstrated:');
    console.log('   ✅ Dynamic composition of coffee features');
    console.log('   ✅ Flexible pricing calculation');
    console.log('   ✅ Ingredient and calorie tracking');
    console.log('   ✅ Extensible without modifying existing code');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const validReport = new ReportBuilder()
  .setTitle('Test Title')
  .setAuthor('Test Author')
  .addSection('Test Section', 'Test content')
  .build();