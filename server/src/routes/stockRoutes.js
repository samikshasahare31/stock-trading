const express = require('express');
const router = express.Router();
const { getAllStocks, searchStocks, getStockBySymbol, getStockById } = require('../controllers/stockController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/stocks:
 *   get:
 *     summary: Get all stocks
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all stocks retrieved successfully
 */
router.get('/', protect, getAllStocks);

/**
 * @swagger
 * /api/stocks/search:
 *   get:
 *     summary: Search stocks by symbol or name
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query for stock symbol or name
 *         example: AAPL
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *       400:
 *         description: Query parameter required
 */
router.get('/search', protect, searchStocks);

/**
 * @swagger
 * /api/stocks/symbol/{symbol}:
 *   get:
 *     summary: Get stock by symbol
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *         required: true
 *         description: Stock symbol (e.g., AAPL)
 *         example: AAPL
 *     responses:
 *       200:
 *         description: Stock retrieved successfully
 *       404:
 *         description: Stock not found
 */
router.get('/symbol/:symbol', protect, getStockBySymbol);

/**
 * @swagger
 * /api/stocks/{id}:
 *   get:
 *     summary: Get stock by ID
 *     tags: [Stocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Stock ID
 *     responses:
 *       200:
 *         description: Stock retrieved successfully
 *       404:
 *         description: Stock not found
 */
router.get('/:id', protect, getStockById);

module.exports = router;
