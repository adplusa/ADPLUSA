import app from './app';
import { config } from './config/env';
import { dbConnection } from './database/connection';

// Start server
const PORT = config.port;

async function startServer() {
  try {
    // Connect to MongoDB
    await dbConnection.connect();

    // Start Express server
    app.listen(PORT, () => {
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
