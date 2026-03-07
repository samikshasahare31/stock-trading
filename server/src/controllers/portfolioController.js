const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// GET /api/portfolio
const getPortfolio = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.user._id })
      .populate('stock', 'symbol name price change changePercent sector');

    res.json({ 
      success: true, 
      data: {
        holdings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/portfolio/summary
const getPortfolioSummary = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user: req.user._id }).populate('stock');
    const user = await require('../models/User').findById(req.user._id);

    let totalInvested = 0;
    let currentValue = 0;

    portfolio.forEach((item) => {
      totalInvested += item.avgBuyPrice * item.quantity;
      currentValue += item.stock.price * item.quantity;
    });

    const profitLoss = currentValue - totalInvested;
    const profitLossPercent = totalInvested > 0 ? ((profitLoss / totalInvested) * 100).toFixed(2) : 0;
    const virtualBalance = (user.balance || 100000) - totalInvested;

    res.json({
      success: true,
      data: {
        virtualBalance: +virtualBalance.toFixed(2),
        totalInvested: +totalInvested.toFixed(2),
        totalCurrentValue: +currentValue.toFixed(2),
        totalProfitLoss: +profitLoss.toFixed(2),
        totalPortfolioValue: +(virtualBalance + currentValue).toFixed(2),
        overallReturn: totalInvested > 0 ? +(profitLoss / totalInvested * 100).toFixed(2) : 0,
        holdingsCount: portfolio.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPortfolio, getPortfolioSummary };
