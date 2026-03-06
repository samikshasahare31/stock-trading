const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// GET /api/portfolio
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user: req.user._id })
      .populate('stock', 'symbol name price change changePercent sector');

    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/portfolio/summary
const getPortfolioSummary = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user: req.user._id }).populate('stock');

    let totalInvested = 0;
    let currentValue = 0;

    portfolio.forEach((item) => {
      totalInvested += item.avgBuyPrice * item.quantity;
      currentValue += item.stock.price * item.quantity;
    });

    const profitLoss = currentValue - totalInvested;
    const profitLossPercent = totalInvested > 0 ? ((profitLoss / totalInvested) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      summary: {
        totalInvested: +totalInvested.toFixed(2),
        currentValue: +currentValue.toFixed(2),
        profitLoss: +profitLoss.toFixed(2),
        profitLossPercent: +profitLossPercent,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPortfolio, getPortfolioSummary };
