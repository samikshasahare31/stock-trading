const express = require('express');
const router = express.Router();
const { buyStock, sellStock, getHistory } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.post('/buy', protect, buyStock);
router.post('/sell', protect, sellStock);
router.get('/history', protect, getHistory);

module.exports = router;
