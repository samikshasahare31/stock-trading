const express = require('express');
const router = express.Router();
const { buy, sell, getHistory } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.post('/buy', protect, buy);
router.post('/sell', protect, sell);
router.get('/history', protect, getHistory);

module.exports = router;
