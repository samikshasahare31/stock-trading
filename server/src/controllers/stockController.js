const Stock = require('../models/Stock');

// GET /api/stocks
const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ symbol: 1 });
    res.json({ success: true, count: stocks.length, stocks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/stocks/search?q=
const searchStocks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Query param q is required.' });

    const stocks = await Stock.find({
      $or: [
        { symbol: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
      ],
    });
    res.json({ success: true, count: stocks.length, stocks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/stocks/symbol/:symbol
const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found.' });
    res.json({ success: true, stock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/stocks/:id
const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found.' });
    res.json({ success: true, stock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllStocks, searchStocks, getStockBySymbol, getStockById };
