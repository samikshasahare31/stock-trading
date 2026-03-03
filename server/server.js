require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n  SB Stocks Server running in ${process.env.NODE_ENV} mode`);
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`  TEST:  http://localhost:${PORT}/api/test\n`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => process.exit(0));
  });
};

startServer();
