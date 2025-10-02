import { Logger } from '../../core/Logger';
import { ApplicationError } from '../../core/ErrorHandler';
import { Validator } from '../../core/Validator';

export abstract class Vehicle {
  protected logger: Logger;

  constructor(
    public readonly id: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly year: number
  ) {
    this.logger = Logger.getInstance();
    Validator.isNotEmpty(id, 'Vehicle ID');
    Validator.isNotEmpty(brand, 'Brand');
    Validator.isNotEmpty(model, 'Model');
    Validator.isInRange(year, 1900, new Date().getFullYear() + 1, 'Year');
  }

  public abstract start(): void;
  public abstract stop(): void;
  public abstract getVehicleInfo(): VehicleInfo;
}

export interface VehicleInfo {
  id: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  specifications: Record<string, any>;
}

export class Car extends Vehicle {
  constructor(
    id: string,
    brand: string,
    model: string,
    year: number,
    private doors: number,
    private fuelType: string
  ) {
    super(id, brand, model, year);
    Validator.isInRange(doors, 2, 6, 'Number of doors');
    Validator.isNotEmpty(fuelType, 'Fuel type');
  }

  public start(): void {
    this.logger.info(`Starting car ${this.brand} ${this.model} - Engine ignition`);
  }

  public stop(): void {
    this.logger.info(`Stopping car ${this.brand} ${this.model} - Engine off`);
  }

  public getVehicleInfo(): VehicleInfo {
    return {
      id: this.id,
      type: 'Car',
      brand: this.brand,
      model: this.model,
      year: this.year,
      specifications: {
        doors: this.doors,
        fuelType: this.fuelType
      }
    };
  }
}

export class Motorcycle extends Vehicle {
  constructor(
    id: string,
    brand: string,
    model: string,
    year: number,
    private engineSize: number,
    private hasWindshield: boolean
  ) {
    super(id, brand, model, year);
    Validator.isPositiveNumber(engineSize, 'Engine size');
  }

  public start(): void {
    this.logger.info(`Starting motorcycle ${this.brand} ${this.model} - Kick start`);
  }

  public stop(): void {
    this.logger.info(`Stopping motorcycle ${this.brand} ${this.model} - Engine off`);
  }

  public getVehicleInfo(): VehicleInfo {
    return {
      id: this.id,
      type: 'Motorcycle',
      brand: this.brand,
      model: this.model,
      year: this.year,
      specifications: {
        engineSize: this.engineSize,
        hasWindshield: this.hasWindshield
      }
    };
  }
}

export class Truck extends Vehicle {
  constructor(
    id: string,
    brand: string,
    model: string,
    year: number,
    private loadCapacity: number,
    private axles: number
  ) {
    super(id, brand, model, year);
    Validator.isPositiveNumber(loadCapacity, 'Load capacity');
    Validator.isInRange(axles, 2, 8, 'Number of axles');
  }

  public start(): void {
    this.logger.info(`Starting truck ${this.brand} ${this.model} - Diesel engine start`);
  }

  public stop(): void {
    this.logger.info(`Stopping truck ${this.brand} ${this.model} - Air brakes engaged`);
  }

  public getVehicleInfo(): VehicleInfo {
    return {
      id: this.id,
      type: 'Truck',
      brand: this.brand,
      model: this.model,
      year: this.year,
      specifications: {
        loadCapacity: this.loadCapacity,
        axles: this.axles
      }
    };
  }
}

export enum VehicleType {
  CAR = 'CAR',
  MOTORCYCLE = 'MOTORCYCLE',
  TRUCK = 'TRUCK'
}

export interface VehicleConfig {
  id: string;
  brand: string;
  model: string;
  year: number;
  specifications: Record<string, any>;
}

export class VehicleFactory {
  private static instance: VehicleFactory;
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
  }

  public static getInstance(): VehicleFactory {
    if (!VehicleFactory.instance) {
      VehicleFactory.instance = new VehicleFactory();
    }
    return VehicleFactory.instance;
  }

  public createVehicle(type: VehicleType, config: VehicleConfig): Vehicle {
    this.logger.info(`Creating vehicle of type: ${type}`);
    
    switch (type) {
      case VehicleType.CAR:
        return new Car(
          config.id,
          config.brand,
          config.model,
          config.year,
          config.specifications.doors || 4,
          config.specifications.fuelType || 'Gasoline'
        );
      
      case VehicleType.MOTORCYCLE:
        return new Motorcycle(
          config.id,
          config.brand,
          config.model,
          config.year,
          config.specifications.engineSize || 150,
          config.specifications.hasWindshield || false
        );
      
      case VehicleType.TRUCK:
        return new Truck(
          config.id,
          config.brand,
          config.model,
          config.year,
          config.specifications.loadCapacity || 1000,
          config.specifications.axles || 2
        );
      
      default:
        throw new ApplicationError(
          `Unknown vehicle type: ${type}`,
          'FACTORY_ERROR'
        );
    }
  }
}
