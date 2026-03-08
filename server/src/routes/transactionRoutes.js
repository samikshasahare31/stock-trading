const express = require('express');
const router = express.Router();
const { buy, sell, getHistory } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/transactions/buy:
 *   post:
 *     summary: Buy stocks
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stockId
 *               - quantity
 *             properties:
 *               stockId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               quantity:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Stock purchased successfully
 *       400:
 *         description: Invalid request or insufficient balance
 */
router.post('/buy', protect, buy);

/**
 * @swagger
 * /api/transactions/sell:
 *   post:
 *     summary: Sell stocks
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stockId
 *               - quantity
 *             properties:
 *               stockId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               quantity:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Stock sold successfully
 *       400:
 *         description: Invalid request or insufficient shares
 */
router.post('/sell', protect, sell);

/**
 * @swagger
 * /api/transactions/history:
 *   get:
 *     summary: Get transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of results per page
 *         example: 20
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [BUY, SELL]
 *         description: Filter by transaction type
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 */
router.get('/history', protect, getHistory);

module.exports = router;
