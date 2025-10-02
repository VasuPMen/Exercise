import { Logger } from '../core/Logger';
import { 
  LegacyMySQLDatabase,
  ModernPostgreSQLDatabase,
  MySQLAdapter,
  PostgreSQLAdapter,
  DatabaseService 
} from '../structural/adapter/DatabaseAdapter';
import { ErrorHandler } from '../core/ErrorHandler';

export class AdapterDemo {
  private logger: Logger;
  private errorHandler: ErrorHandler;

  constructor() {
    this.logger = Logger.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public async demonstrate(): Promise<void> {
    console.log('\n🔌 Adapter Pattern Demo - Database Integration');
    console.log('=============================================');

    // Demonstrate MySQL adapter
    await this.demonstrateMySQLAdapter();
    await this.sleep(2000);

    // Demonstrate PostgreSQL adapter
    await this.demonstratePostgreSQLAdapter();
    await this.sleep(2000);

    // Demonstrate switching between databases
    await this.demonstrateDatabaseSwitching();

    console.log('\n✅ Adapter Pattern Demo completed!');
  }

  private async demonstrateMySQLAdapter(): Promise<void> {
    console.log('\n🐬 Demonstrating Legacy MySQL Database Adapter...');
    
    try {
      // Create legacy MySQL database instance
      const legacyMySQL = new LegacyMySQLDatabase('mysql://localhost:3306/legacy_db');
      
      // Wrap it with our adapter
      const mysqlAdapter = new MySQLAdapter(legacyMySQL);
      
      // Create database service using the adapter
      const dbService = new DatabaseService(mysqlAdapter);
      
      // Connect to database
      await mysqlAdapter.connect();
      console.log(`📊 MySQL Connection Status: ${mysqlAdapter.isConnected() ? 'Connected' : 'Disconnected'}`);
      
      // Execute query through the service
      console.log('🔍 Executing query through database service...');
      const result = await dbService.executeQuery('SELECT * FROM users');
      
      console.log('✅ MySQL Query Results:');
      console.log(`   📝 Rows returned: ${result.rowCount}`);
      console.log(`   ⏱️ Execution time: ${result.executionTime}ms`);
      console.log('   📋 Sample data:', result.rows[0]);
      
      // Disconnect
      await mysqlAdapter.disconnect();
      console.log(`📊 MySQL Connection Status: ${mysqlAdapter.isConnected() ? 'Connected' : 'Disconnected'}`);
      
    } catch (error) {
      this.errorHandler.handleError(error, 'MySQLAdapterDemo');
    }
  }

  private async demonstratePostgreSQLAdapter(): Promise<void> {
    console.log('\n🐘 Demonstrating Modern PostgreSQL Database Adapter...');
    
    try {
      // Create modern PostgreSQL database instance
      const modernPostgreSQL = new ModernPostgreSQLDatabase({
        host: 'localhost',
        port: 5432,
        database: 'modern_db',
        user: 'postgres',
        password: 'password'
      });
      
      // Wrap it with our adapter
      const postgresAdapter = new PostgreSQLAdapter(modernPostgreSQL);
      
      // Create database service using the adapter
      const dbService = new DatabaseService(postgresAdapter);
      
      // Connect to database
      await postgresAdapter.connect();
      console.log(`📊 PostgreSQL Connection Status: ${postgresAdapter.isConnected() ? 'Connected' : 'Disconnected'}`);
      
      // Execute query through the service
      console.log('🔍 Executing query through database service...');
      const result = await dbService.executeQuery('SELECT * FROM users');
      
      console.log('✅ PostgreSQL Query Results:');
      console.log(`   📝 Rows returned: ${result.rowCount}`);
      console.log(`   ⏱️ Execution time: ${result.executionTime}ms`);
      console.log('   📋 Sample data:', result.rows[0]);
      
      // Disconnect
      await postgresAdapter.disconnect();
      console.log(`📊 PostgreSQL Connection Status: ${postgresAdapter.isConnected() ? 'Connected' : 'Disconnected'}`);
      
    } catch (error) {
      this.errorHandler.handleError(error, 'PostgreSQLAdapterDemo');
    }
  }

  private async demonstrateDatabaseSwitching(): Promise<void> {
    console.log('\n🔄 Demonstrating Dynamic Database Switching...');
    
    try {
      // Start with MySQL
      const legacyMySQL = new LegacyMySQLDatabase('mysql://localhost:3306/legacy_db');
      const mysqlAdapter = new MySQLAdapter(legacyMySQL);
      
      const dbService = new DatabaseService(mysqlAdapter);
      await mysqlAdapter.connect();
      
      console.log('📊 Starting with MySQL database...');
      let result = await dbService.executeQuery('SELECT * FROM users');
      console.log(`   MySQL result: ${result.rowCount} rows in ${result.executionTime}ms`);
      
      // Switch to PostgreSQL
      console.log('🔄 Switching to PostgreSQL database...');
      const modernPostgreSQL = new ModernPostgreSQLDatabase({
        host: 'localhost',
        port: 5432,
        database: 'modern_db',
        user: 'postgres',
        password: 'password'
      });
      const postgresAdapter = new PostgreSQLAdapter(modernPostgreSQL);
      
      await dbService.switchDatabase(postgresAdapter);
      
      result = await dbService.executeQuery('SELECT * FROM users');
      console.log(`   PostgreSQL result: ${result.rowCount} rows in ${result.executionTime}ms`);
      
      console.log('✅ Database switching completed successfully!');
      console.log('   🔧 The same DatabaseService interface worked with both databases');
      console.log('   🎯 This demonstrates the power of the Adapter pattern');
      
    } catch (error) {
      this.errorHandler.handleError(error, 'DatabaseSwitchingDemo');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
