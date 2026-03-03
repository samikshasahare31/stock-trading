const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

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

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'SB Stocks API is running', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

module.exports = app;
