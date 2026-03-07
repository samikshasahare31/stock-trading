const express = require('express');
const router = express.Router();
const { getAllStocks, searchStocks, getStockBySymbol, getStockById } = require('../controllers/stockController');
const { protect } = require('../middleware/auth');

// Important: /search and /symbol/:symbol must be defined BEFORE /:id
router.get('/search', protect, searchStocks);
router.get('/symbol/:symbol', protect, getStockBySymbol);
router.get('/', protect, getAllStocks);
router.get('/:id', protect, getStockById);

module.exports = router;
