const express = require('express');
const router = express.Router();
const { getPortfolio, getPortfolioSummary } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getPortfolio);
router.get('/summary', protect, getPortfolioSummary);

module.exports = router;
