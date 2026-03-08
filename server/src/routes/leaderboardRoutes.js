const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/leaderboard:
 *   get:
 *     summary: Get leaderboard rankings
 *     tags: [Leaderboard]
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
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getLeaderboard);

module.exports = router;
