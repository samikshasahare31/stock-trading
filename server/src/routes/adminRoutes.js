const express = require('express');
const router = express.Router();
const {
  getAllUsers, getUserById,
  addStock, updateStock, deleteStock,
  getPlatformStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require both protect + adminOnly
router.use(protect, adminOnly);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/users/:id', getUserById);

/**
 * @swagger
 * /api/admin/stocks:
 *   post:
 *     summary: Add new stock (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - name
 *               - price
 *             properties:
 *               symbol:
 *                 type: string
 *                 example: AAPL
 *               name:
 *                 type: string
 *                 example: Apple Inc.
 *               price:
 *                 type: number
 *                 example: 150.25
 *               change:
 *                 type: number
 *                 example: 2.5
 *               changePercent:
 *                 type: number
 *                 example: 1.69
 *               sector:
 *                 type: string
 *                 example: Technology
 *     responses:
 *       201:
 *         description: Stock added successfully
 *       400:
 *         description: Invalid input
 */
router.post('/stocks', addStock);

/**
 * @swagger
 * /api/admin/stocks/{id}:
 *   put:
 *     summary: Update stock (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Stock ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symbol:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               currentPrice:
 *                 type: number
 *               change:
 *                 type: number
 *               changePercent:
 *                 type: number
 *               sector:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       404:
 *         description: Stock not found
 */
router.put('/stocks/:id', updateStock);

/**
 * @swagger
 * /api/admin/stocks/{id}:
 *   delete:
 *     summary: Delete stock (Admin only)
 *     tags: [Admin]
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
 *         description: Stock deleted successfully
 *       404:
 *         description: Stock not found
 */
router.delete('/stocks/:id', deleteStock);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get platform statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform statistics retrieved successfully
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/stats', getPlatformStats);

module.exports = router;
