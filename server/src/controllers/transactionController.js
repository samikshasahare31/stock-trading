const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const User = require('../models/User');

// POST /api/transactions/buy
const buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    if (!stockId || !quantity || quantity < 1)
      return res.status(400).json({ success: false, message: 'stockId and quantity (min 1) are required.' });

    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found.' });

    const total = stock.price * quantity;
    const user = await User.findById(req.user._id);

    if (user.balance < total)
      return res.status(400).json({ success: false, message: 'Insufficient balance.' });

    // Deduct balance
    user.balance -= total;
    await user.save();

    // Create transaction
    await Transaction.create({ user: user._id, stock: stockId, type: 'buy', quantity, price: stock.price, total });

    // Update portfolio
    const existing = await Portfolio.findOne({ user: user._id, stock: stockId });
    if (existing) {
      const newQty = existing.quantity + quantity;
      existing.avgBuyPrice = ((existing.avgBuyPrice * existing.quantity) + total) / newQty;
      existing.quantity = newQty;
      await existing.save();
    } else {
      await Portfolio.create({ user: user._id, stock: stockId, quantity, avgBuyPrice: stock.price });
    }

    res.status(201).json({ success: true, message: `Bought ${quantity} share(s) of ${stock.symbol}.`, balance: user.balance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/transactions/sell
const sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    if (!stockId || !quantity || quantity < 1)
      return res.status(400).json({ success: false, message: 'stockId and quantity (min 1) are required.' });

    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found.' });

    const holding = await Portfolio.findOne({ user: req.user._id, stock: stockId });
    if (!holding || holding.quantity < quantity)
      return res.status(400).json({ success: false, message: 'Insufficient shares to sell.' });

    const total = stock.price * quantity;
    const user = await User.findById(req.user._id);

    // Credit balance
    user.balance += total;
    await user.save();

    // Create transaction
    await Transaction.create({ user: user._id, stock: stockId, type: 'sell', quantity, price: stock.price, total });

    // Update portfolio
    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      await holding.deleteOne();
    } else {
      await holding.save();
    }

    res.json({ success: true, message: `Sold ${quantity} share(s) of ${stock.symbol}.`, balance: user.balance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/transactions/history
const getHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('stock', 'symbol name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { buyStock, sellStock, getHistory };
