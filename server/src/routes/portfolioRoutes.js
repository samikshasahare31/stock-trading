const express = require('express');
const router = express.Router();
const { getPortfolio, getPortfolioSummary } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/portfolio:
 *   get:
 *     summary: Get user portfolio holdings
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Portfolio holdings retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getPortfolio);

/**
 * @swagger
 * /api/portfolio/summary:
 *   get:
 *     summary: Get portfolio summary with total invested and current value
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Portfolio summary retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/summary', protect, getPortfolioSummary);

module.exports = router;
