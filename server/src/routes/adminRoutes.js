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

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/stocks', addStock);
router.put('/stocks/:id', updateStock);
router.delete('/stocks/:id', deleteStock);
router.get('/stats', getPlatformStats);

module.exports = router;
