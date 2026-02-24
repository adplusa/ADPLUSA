import mongoose from 'mongoose';
import { config } from '../config/env';

interface ConnectionOptions {
  maxRetries?: number;
  retryDelay?: number;
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number;
  private retryDelay: number;

  private constructor(options: ConnectionOptions = {}) {
    this.maxRetries = options.maxRetries || 5;
    this.retryDelay = options.retryDelay || 5000; // 5 seconds
  }

  public static getInstance(options?: ConnectionOptions): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(options);
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      
      return;
    }

    try {
      // Configure Mongoose connection options
      mongoose.set('strictQuery', false);

      // Connect to MongoDB with serverless-optimized connection pooling
      mongoose.set('bufferCommands', false); // Fail fast instead of buffering commands
      await mongoose.connect(config.mongodbUri, {
        maxPoolSize: 2,  // Reduced pool size for serverless (Lambda)
        minPoolSize: 1,  // Minimum connections for serverless
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        serverSelectionTimeoutMS: 3000, // Reduced timeout for faster failure in serverless
      });

      this.isConnected = true;
      this.retryCount = 0;

      
      // Set up connection event listeners
      this.setupEventListeners();

    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      await this.handleConnectionError(error);
    }
  }

  private setupEventListeners(): void {
    // Connection events
    mongoose.connection.on('connected', () => {
      
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ Mongoose connection error:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      
      this.isConnected = false;
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  private async handleConnectionError(error: unknown): Promise<void> {
    this.retryCount++;

    if (this.retryCount <= this.maxRetries) {


      await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      await this.connect();
    } else {
      console.error(
        `❌ Failed to connect to MongoDB after ${this.maxRetries} attempts`
      );
      throw new Error(
        `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public getConnection(): typeof mongoose {
    return mongoose;
  }
}

// Export singleton instance
export const dbConnection = DatabaseConnection.getInstance();

// Export for testing with custom options
export { DatabaseConnection };
