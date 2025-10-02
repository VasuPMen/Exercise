import { Logger } from '../../core/Logger';
import { Validator } from '../../core/Validator';
import { ApplicationError } from '../../core/ErrorHandler';

export interface Coffee {
  getDescription(): string;
  getPrice(): number;
  getIngredients(): string[];
  getCalories(): number;
}

// Base coffee implementation
export class BasicCoffee implements Coffee {
  private logger: Logger;

  constructor(
    protected name: string = 'Basic Coffee',
    protected basePrice: number = 2.50,
    protected baseIngredients: string[] = ['Coffee beans', 'Water'],
    protected baseCalories: number = 5
  ) {
    this.logger = Logger.getInstance();
    Validator.isPositiveNumber(basePrice, 'Base price');
  }

  public getDescription(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.basePrice;
  }

  public getIngredients(): string[] {
    return [...this.baseIngredients];
  }

  public getCalories(): number {
    return this.baseCalories;
  }
}

// Concrete coffee types
export class Espresso extends BasicCoffee {
  constructor() {
    super('Espresso', 3.00, ['Espresso beans', 'Water'], 10);
  }
}

export class Americano extends BasicCoffee {
  constructor() {
    super('Americano', 3.50, ['Espresso beans', 'Hot water'], 15);
  }
}

// Base decorator
export abstract class CoffeeDecorator implements Coffee {
  protected logger: Logger;

  constructor(protected coffee: Coffee) {
    this.logger = Logger.getInstance();
    if (!coffee) {
      throw new ApplicationError('Coffee instance is required for decorator', 'DECORATOR_ERROR');
    }
  }

  public getDescription(): string {
    return this.coffee.getDescription();
  }

  public getPrice(): number {
    return this.coffee.getPrice();
  }

  public getIngredients(): string[] {
    return this.coffee.getIngredients();
  }

  public getCalories(): number {
    return this.coffee.getCalories();
  }
}

// Concrete decorators
export class MilkDecorator extends CoffeeDecorator {
  private readonly milkPrice: number = 0.60;
  private readonly milkCalories: number = 25;

  constructor(coffee: Coffee, private milkType: string = 'Whole milk') {
    super(coffee);
    Validator.isNotEmpty(milkType, 'Milk type');
  }

  public getDescription(): string {
    return `${this.coffee.getDescription()} with ${this.milkType}`;
  }

  public getPrice(): number {
    return this.coffee.getPrice() + this.milkPrice;
  }

  public getIngredients(): string[] {
    return [...this.coffee.getIngredients(), this.milkType];
  }

  public getCalories(): number {
    return this.coffee.getCalories() + this.milkCalories;
  }
}

export class SugarDecorator extends CoffeeDecorator {
  private readonly sugarPrice: number = 0.10;
  private readonly sugarCaloriesPerPacket: number = 15;

  constructor(coffee: Coffee, private packets: number = 1) {
    super(coffee);
    Validator.isPositiveNumber(packets, 'Sugar packets');
    Validator.isInRange(packets, 1, 10, 'Sugar packets');
  }

  public getDescription(): string {
    const packetText = this.packets === 1 ? 'packet' : 'packets';
    return `${this.coffee.getDescription()} with ${this.packets} ${packetText} of sugar`;
  }

  public getPrice(): number {
    return this.coffee.getPrice() + (this.sugarPrice * this.packets);
  }

  public getIngredients(): string[] {
    return [...this.coffee.getIngredients(), `Sugar (${this.packets} packets)`];
  }

  public getCalories(): number {
    return this.coffee.getCalories() + (this.sugarCaloriesPerPacket * this.packets);
  }
}

export class VanillaSyrupDecorator extends CoffeeDecorator {
  private readonly syrupPrice: number = 0.75;
  private readonly syrupCalories: number = 35;

  constructor(coffee: Coffee, private pumps: number = 1) {
    super(coffee);
    Validator.isPositiveNumber(pumps, 'Syrup pumps');
    Validator.isInRange(pumps, 1, 5, 'Syrup pumps');
  }

  public getDescription(): string {
    const pumpText = this.pumps === 1 ? 'pump' : 'pumps';
    return `${this.coffee.getDescription()} with ${this.pumps} ${pumpText} of vanilla syrup`;
  }

  public getPrice(): number {
    return this.coffee.getPrice() + (this.syrupPrice * this.pumps);
  }

  public getIngredients(): string[] {
    return [...this.coffee.getIngredients(), `Vanilla syrup (${this.pumps} pumps)`];
  }

  public getCalories(): number {
    return this.coffee.getCalories() + (this.syrupCalories * this.pumps);
  }
}

export class WhippedCreamDecorator extends CoffeeDecorator {
  private readonly creamPrice: number = 0.50;
  private readonly creamCalories: number = 45;

  public getDescription(): string {
    return `${this.coffee.getDescription()} with whipped cream`;
  }

  public getPrice(): number {
    return this.coffee.getPrice() + this.creamPrice;
  }

  public getIngredients(): string[] {
    return [...this.coffee.getIngredients(), 'Whipped cream'];
  }

  public getCalories(): number {
    return this.coffee.getCalories() + this.creamCalories;
  }
}

export class ExtraShotDecorator extends CoffeeDecorator {
  private readonly shotPrice: number = 0.85;
  private readonly shotCalories: number = 10;

  constructor(coffee: Coffee, private shots: number = 1) {
    super(coffee);
    Validator.isPositiveNumber(shots, 'Extra shots');
    Validator.isInRange(shots, 1, 4, 'Extra shots');
  }

  public getDescription(): string {
    const shotText = this.shots === 1 ? 'extra shot' : 'extra shots';
    return `${this.coffee.getDescription()} with ${this.shots} ${shotText}`;
  }

  public getPrice(): number {
    return this.coffee.getPrice() + (this.shotPrice * this.shots);
  }

  public getIngredients(): string[] {
    return [...this.coffee.getIngredients(), `Extra espresso shots (${this.shots})`];
  }

  public getCalories(): number {
    return this.coffee.getCalories() + (this.shotCalories * this.shots);
  }
}

// Coffee shop order management
export interface CoffeeOrder {
  id: string;
  coffee: Coffee;
  customerName: string;
  orderTime: Date;
  totalPrice: number;
}

export class CoffeeShop {
  private orders: CoffeeOrder[] = [];
  private orderCounter: number = 1;
  private logger: Logger;

  constructor(private shopName: string) {
    this.logger = Logger.getInstance();
    Validator.isNotEmpty(shopName, 'Shop name');
  }

  public createOrder(coffee: Coffee, customerName: string): CoffeeOrder {
    Validator.isNotEmpty(customerName, 'Customer name');

    const order: CoffeeOrder = {
      id: `ORD-${this.orderCounter.toString().padStart(4, '0')}`,
      coffee,
      customerName,
      orderTime: new Date(),
      totalPrice: coffee.getPrice()
    };

    this.orders.push(order);
    this.orderCounter++;

    this.logger.info(`Order created: ${order.id} for ${customerName} - ${coffee.getDescription()}`);
    return order;
  }

  public getOrderHistory(): CoffeeOrder[] {
    return [...this.orders];
  }

  public getTotalRevenue(): number {
    return this.orders.reduce((total, order) => total + order.totalPrice, 0);
  }

  public printReceipt(order: CoffeeOrder): string {
    const receipt = `
========================================
${this.shopName}
========================================
Order ID: ${order.id}
Customer: ${order.customerName}
Date: ${order.orderTime.toLocaleString()}

Item: ${order.coffee.getDescription()}
Ingredients: ${order.coffee.getIngredients().join(', ')}
Calories: ${order.coffee.getCalories()}

Total Price: ${order.coffee.getPrice().toFixed(2)}
========================================
Thank you for your business!
========================================
`;
    return receipt;
  }
}


