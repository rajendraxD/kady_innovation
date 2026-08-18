import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/unifiedConfig.js';
import { seedInitialData } from './utils/seedData.js';

const startServer = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    await seedInitialData();
  }

  const server = app.listen(config.port, () => {
    console.log(`====================================================`);
    console.log(`  KADY Server Running on Port: ${config.port}`);
    console.log(`  Environment: ${config.env}`);
    console.log(`  Admin Default: admin@email.com / admin@123`);
    console.log(`  Health check: http://localhost:${config.port}/api/health`);
    console.log(`====================================================`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('Shutting down server gracefully...');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
