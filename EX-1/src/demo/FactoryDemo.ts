import { Logger } from '../core/Logger';
import { 
  VehicleFactory, 
  VehicleType, 
  VehicleConfig 
} from '../creational/factory/VehicleFactory';
import { ErrorHandler } from '../core/ErrorHandler';

export class FactoryDemo {
  private logger: Logger;
  private errorHandler: ErrorHandler;
  private vehicleFactory: VehicleFactory;

  constructor() {
    this.logger = Logger.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.vehicleFactory = VehicleFactory.getInstance();
  }

  public async demonstrate(): Promise<void> {
    console.log('\n🚗 Factory Pattern Demo - Vehicle Manufacturing');
    console.log('===============================================');

    console.log('\n🏭 Creating different types of vehicles using the factory...');

    // Create a car
    await this.createCar();
    await this.sleep(1500);

    // Create a motorcycle
    await this.createMotorcycle();
    await this.sleep(1500);

    // Create a truck
    await this.createTruck();
    await this.sleep(1500);

    // Demonstrate error handling
    await this.demonstrateErrorHandling();

    console.log('\n✅ Factory Pattern Demo completed!');
  }

  private async createCar(): Promise<void> {
    console.log('\n🚙 Creating a Car...');
    
    const carConfig: VehicleConfig = {
      id: 'CAR-001',
      brand: 'Toyota',
      model: 'Camry',
      year: 2024,
      specifications: {
        doors: 4,
        fuelType: 'Hybrid'
      }
    };

    try {
      const car = this.vehicleFactory.createVehicle(VehicleType.CAR, carConfig);
      console.log(`✅ Car created: ${JSON.stringify(car.getVehicleInfo(), null, 2)}`);
      
      car.start();
      await this.sleep(500);
      car.stop();
    } catch (error) {
      this.errorHandler.handleError(error, 'CarCreation');
    }
  }

  private async createMotorcycle(): Promise<void> {
    console.log('\n🏍️ Creating a Motorcycle...');
    
    const motorcycleConfig: VehicleConfig = {
      id: 'MOTO-001',
      brand: 'Harley-Davidson',
      model: 'Street 750',
      year: 2023,
      specifications: {
        engineSize: 750,
        hasWindshield: true
      }
    };

    try {
      const motorcycle = this.vehicleFactory.createVehicle(VehicleType.MOTORCYCLE, motorcycleConfig);
      console.log(`✅ Motorcycle created: ${JSON.stringify(motorcycle.getVehicleInfo(), null, 2)}`);
      
      motorcycle.start();
      await this.sleep(500);
      motorcycle.stop();
    } catch (error) {
      this.errorHandler.handleError(error, 'MotorcycleCreation');
    }
  }

  private async createTruck(): Promise<void> {
    console.log('\n🚚 Creating a Truck...');
    
    const truckConfig: VehicleConfig = {
      id: 'TRUCK-001',
      brand: 'Ford',
      model: 'F-150',
      year: 2024,
      specifications: {
        loadCapacity: 1500,
        axles: 3
      }
    };

    try {
      const truck = this.vehicleFactory.createVehicle(VehicleType.TRUCK, truckConfig);
      console.log(`✅ Truck created: ${JSON.stringify(truck.getVehicleInfo(), null, 2)}`);
      
      truck.start();
      await this.sleep(500);
      truck.stop();
    } catch (error) {
      this.errorHandler.handleError(error, 'TruckCreation');
    }
  }

  private async demonstrateErrorHandling(): Promise<void> {
    console.log('\n⚠️ Demonstrating error handling with invalid configuration...');
    
    const invalidConfig: VehicleConfig = {
      id: '', // Invalid empty ID
      brand: 'Tesla',
      model: 'Model S',
      year: 2024,
      specifications: {}
    };

    try {
      const vehicle = this.vehicleFactory.createVehicle(VehicleType.CAR, invalidConfig);
    } catch (error) {
      console.log('❌ Expected error caught and handled properly');
      this.errorHandler.handleError(error, 'InvalidVehicleCreation');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}