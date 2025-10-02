import { Logger } from '../../core/Logger';
import { ApplicationError } from '../../core/ErrorHandler';
import { Validator } from '../../core/Validator';

export interface DatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}

export interface QueryResult {
  rows: any[];
  rowCount: number;
  executionTime: number;
}

// Legacy MySQL Database (Third-party library simulation)
export class LegacyMySQLDatabase {
  private connected: boolean = false;
  private logger: Logger;

  constructor(private connectionString: string) {
    this.logger = Logger.getInstance();
    Validator.isNotEmpty(connectionString, 'Connection string');
  }

  public async mysql_connect(): Promise<void> {
    this.logger.info('Connecting to legacy MySQL database...');
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    this.connected = true;
    this.logger.info('Legacy MySQL connected');
  }

  public async mysql_disconnect(): Promise<void> {
    this.logger.info('Disconnecting from legacy MySQL database...');
    this.connected = false;
  }

  public mysql_is_connected(): boolean {
    return this.connected;
  }

  public async mysql_query(sql: string): Promise<{ data: any[], count: number, time: number }> {
    if (!this.connected) {
      throw new ApplicationError('MySQL not connected', 'DATABASE_ERROR', true);
    }

    const startTime = Date.now();
    // Simulate query execution
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
    
    const mockData = [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' }
    ];

    return {
      data: mockData,
      count: mockData.length,
      time: Date.now() - startTime
    };
  }
}

// Modern PostgreSQL Database (Another third-party library simulation)
export class ModernPostgreSQLDatabase {
  private connectionStatus: boolean = false;
  private logger: Logger;

  constructor(private config: { host: string; port: number; database: string; user: string; password: string }) {
    this.logger = Logger.getInstance();
    Validator.isNotEmpty(config.host, 'Host');
    Validator.isNotEmpty(config.database, 'Database name');
    Validator.isNotEmpty(config.user, 'Username');
  }

  public async pgConnect(): Promise<void> {
    this.logger.info('Connecting to modern PostgreSQL database...');
    await new Promise(resolve => setTimeout(resolve, 300));
    this.connectionStatus = true;
    this.logger.info('PostgreSQL connected');
  }

  public async pgDisconnect(): Promise<void> {
    this.logger.info('Disconnecting from PostgreSQL database...');
    this.connectionStatus = false;
  }

  public pgConnectionStatus(): boolean {
    return this.connectionStatus;
  }

  public async pgExecute(query: string): Promise<{ records: any[], total: number, duration: number }> {
    if (!this.connectionStatus) {
      throw new ApplicationError('PostgreSQL not connected', 'DATABASE_ERROR', true);
    }

    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 30));
    
    const mockRecords = [
      { user_id: 1, username: 'john_doe', email_address: 'john@example.com' },
      { user_id: 2, username: 'jane_smith', email_address: 'jane@example.com' }
    ];

    return {
      records: mockRecords,
      total: mockRecords.length,
      duration: Date.now() - startTime
    };
  }
}

// Our application's standard database interface
export interface IDatabase extends DatabaseConnection {
  query(sql: string): Promise<QueryResult>;
}

// Adapter for Legacy MySQL
export class MySQLAdapter implements IDatabase {
  private logger: Logger;

  constructor(private mysqlDb: LegacyMySQLDatabase) {
    this.logger = Logger.getInstance();
  }

  public async connect(): Promise<void> {
    await this.mysqlDb.mysql_connect();
    this.logger.info('MySQL adapter connected');
  }

  public async disconnect(): Promise<void> {
    await this.mysqlDb.mysql_disconnect();
    this.logger.info('MySQL adapter disconnected');
  }

  public isConnected(): boolean {
    return this.mysqlDb.mysql_is_connected();
  }

  public async query(sql: string): Promise<QueryResult> {
    try {
      const result = await this.mysqlDb.mysql_query(sql);
      return {
        rows: result.data,
        rowCount: result.count,
        executionTime: result.time
      };
    } catch (error) {
      this.logger.error('MySQL query failed', error as Error);
      throw error;
    }
  }
}

// Adapter for Modern PostgreSQL
export class PostgreSQLAdapter implements IDatabase {
  private logger: Logger;

  constructor(private pgDb: ModernPostgreSQLDatabase) {
    this.logger = Logger.getInstance();
  }

  public async connect(): Promise<void> {
    await this.pgDb.pgConnect();
    this.logger.info('PostgreSQL adapter connected');
  }

  public async disconnect(): Promise<void> {
    await this.pgDb.pgDisconnect();
    this.logger.info('PostgreSQL adapter disconnected');
  }

  public isConnected(): boolean {
    return this.pgDb.pgConnectionStatus();
  }

  public async query(sql: string): Promise<QueryResult> {
    try {
      const result = await this.pgDb.pgExecute(sql);
      return {
        rows: result.records,
        rowCount: result.total,
        executionTime: result.duration
      };
    } catch (error) {
      this.logger.error('PostgreSQL query failed', error as Error);
      throw error;
    }
  }
}

// Database service that uses the unified interface
export class DatabaseService {
  private logger: Logger;

  constructor(private database: IDatabase) {
    this.logger = Logger.getInstance();
  }

  public async executeQuery(sql: string): Promise<QueryResult> {
    if (!this.database.isConnected()) {
      throw new ApplicationError('Database not connected', 'SERVICE_ERROR');
    }

    this.logger.info('Executing query through database service');
    return await this.database.query(sql);
  }

  public async switchDatabase(newDatabase: IDatabase): Promise<void> {
    if (this.database.isConnected()) {
      await this.database.disconnect();
    }
    
    this.database = newDatabase;
    await this.database.connect();
    this.logger.info('Database switched successfully');
  }
}