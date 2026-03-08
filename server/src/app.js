const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/watchlist', require('./routes/watchlistRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// Health check
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'SB Stocks API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

module.exports = app;
