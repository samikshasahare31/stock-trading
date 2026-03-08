const Transaction = require('../models/Transaction');
const { buyStock, sellStock } = require('../services/transactionService');
const ApiResponse = require('../utils/apiResponse');

// POST /api/transactions/buy
const buy = async (req, res, next) => {
  try {
    const { stockId, quantity } = req.body;
    const result = await buyStock(req.user._id, stockId, quantity);

    res.status(201).json(
      new ApiResponse(201, 'Stock purchased successfully', {
        transaction: result.transaction,
        holding: result.holding,
        newBalance: result.newBalance,
      })
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/transactions/sell
const sell = async (req, res, next) => {
  try {
    const { stockId, quantity } = req.body;
    const result = await sellStock(req.user._id, stockId, quantity);

    res.status(201).json(
      new ApiResponse(201, 'Stock sold successfully', {
        transaction: result.transaction,
        profitLoss: result.profitLoss,
        newBalance: result.newBalance,
      })
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/transactions/history
const getHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    const filter = { user: req.user._id };
    if (type) filter.type = type.toUpperCase();

    const transactions = await Transaction.find(filter)
      .populate('stock', 'symbol name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, 'Transaction history retrieved', {
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { buy, sell, getHistory };
