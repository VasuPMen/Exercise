import { Logger, LogLevel } from './core/Logger';
import { ErrorHandler } from './core/ErrorHandler';
import { MenuService, MenuItem } from './services/MenuService';
import { ObserverDemo } from './demo/ObserverDemo';
import { StrategyDemo } from './demo/StrategyDemo';
import { FactoryDemo } from './demo/FactoryDemo';
import { BuilderDemo } from './demo/BuilderDemo';
import { AdapterDemo } from './demo/AdapterDemo';
import { DecoratorDemo } from './demo/DecoratorDemo';

class DesignPatternsApplication {
  private logger: Logger;
  private errorHandler: ErrorHandler;
  private menuService: MenuService;

  constructor() {
    this.logger = Logger.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.menuService = new MenuService();
    
    this.initializeApplication();
    this.setupMenu();
  }

  private initializeApplication(): void {
    this.logger.setLogLevel(LogLevel.INFO);
    this.logger.info('Design Patterns Demo Application Starting...');
    
    console.log('🎯 Design Patterns Exercise - TypeScript Implementation');
    console.log('=====================================================');
    console.log('📚 Demonstrating 6 creative use cases:');
    console.log('   🧠 Behavioral Patterns: Observer, Strategy');
    console.log('   🏗️ Creational Patterns: Factory, Builder');
    console.log('   🔗 Structural Patterns: Adapter, Decorator');
    console.log('=====================================================\n');
  }

  private setupMenu(): void {
    const menuItems: MenuItem[] = [
      {
        id: 'observer_demo',
        title: '🔔 Observer Pattern - Notification System',
        description: 'Real-time notification system with multiple service subscriptions',
        action: async () => {
          const demo = new ObserverDemo();
          await demo.demonstrate();
        }
      },
      {
        id: 'strategy_demo',
        title: '💳 Strategy Pattern - Payment Processing',
        description: 'Flexible payment processing with multiple payment strategies',
        action: async () => {
          const demo = new StrategyDemo();
          await demo.demonstrate();
        }
      },
      {
        id: 'factory_demo',
        title: '🏭 Factory Pattern - Vehicle Manufacturing',
        description: 'Dynamic vehicle creation using factory pattern',
        action: async () => {
          const demo = new FactoryDemo();
          await demo.demonstrate();
        }
      },
      {
        id: 'builder_demo',
        title: '📊 Builder Pattern - Report Generation',
        description: 'Complex report building with flexible configuration',
        action: async () => {
          const demo = new BuilderDemo();
          await demo.demonstrate();
        }
      },
      {
        id: 'adapter_demo',
        title: '🔌 Adapter Pattern - Database Integration',
        description: 'Seamless integration of different database systems',
        action: async () => {
          const demo = new AdapterDemo();
          await demo.demonstrate();
        }
      },
      {
        id: 'decorator_demo',
        title: '☕ Decorator Pattern - Coffee Shop Customization',
        description: 'Dynamic coffee customization with flexible pricing',
        action: async () => {
          const demo = new DecoratorDemo();
          await demo.demonstrate();
        }
      }
    ];

    this.menuService.setMenu(menuItems);
  }

  public async run(): Promise<void> {
    try {
      await this.menuService.start();
    } catch (error) {
      this.errorHandler.handleError(error, 'DesignPatternsApplication.run');
    } finally {
      this.logger.info('Design Patterns Demo Application Ended');
    }
  }
}

// Application entry point
async function main(): Promise<void> {
  const app = new DesignPatternsApplication();
  await app.run();
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  const errorHandler = ErrorHandler.getInstance();
  errorHandler.handleError(error, 'UncaughtException');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  const errorHandler = ErrorHandler.getInstance();
  errorHandler.handleError(reason, 'UnhandledRejection');
});

// Start the application
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error starting application:', error);
    process.exit(1);
  });
}

export default DesignPatternsApplication;