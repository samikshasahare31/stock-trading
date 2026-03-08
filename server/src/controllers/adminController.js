const User = require('../models/User');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/stocks
const addStock = async (req, res) => {
  try {
    const { symbol, name, price, change, changePercent, sector } = req.body;
    if (!symbol || !name || !price)
      return res.status(400).json({ success: false, message: 'symbol, name, and price are required.' });

    const stock = await Stock.create({ 
      symbol, 
      name, 
      price, 
      currentPrice: price,  // Set currentPrice to price initially
      change: change || 0, 
      changePercent: changePercent || 0, 
      sector: sector || 'General' 
    });
    res.status(201).json({ success: true, stock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/stocks/:id
const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found.' });
    res.json({ success: true, stock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/stocks/:id
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found.' });
    res.json({ success: true, message: 'Stock deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/stats
const getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, totalStocks, totalTransactions] = await Promise.all([
      User.countDocuments(),
      Stock.countDocuments(),
      Transaction.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalStocks, totalTransactions },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, addStock, updateStock, deleteStock, getPlatformStats };
