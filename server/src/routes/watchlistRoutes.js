const express = require('express');
const router = express.Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/watchlist:
 *   get:
 *     summary: Get user's watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Watchlist retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getWatchlist);

/**
 * @swagger
 * /api/watchlist/add:
 *   post:
 *     summary: Add stock to watchlist
 *     tags: [Watchlist]
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
 *             properties:
 *               stockId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Stock added to watchlist successfully
 *       400:
 *         description: Invalid request or stock already in watchlist
 */
router.post('/add', protect, addToWatchlist);

/**
 * @swagger
 * /api/watchlist/remove:
 *   delete:
 *     summary: Remove stock from watchlist
 *     tags: [Watchlist]
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
 *             properties:
 *               stockId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Stock removed from watchlist successfully
 *       404:
 *         description: Stock not found in watchlist
 */
router.delete('/remove', protect, removeFromWatchlist);

module.exports = router;
