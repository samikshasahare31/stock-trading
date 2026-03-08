const mongoose = require('mongoose');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const ApiError = require('../utils/ApiError');

const buyStock = async (userId, stockId, quantity) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const stock = await Stock.findById(stockId).session(session);
    if (!stock) throw new ApiError(404, 'Stock not found');
    if (!stock.isActive) throw new ApiError(400, 'Stock is not available for trading');

    const currentPrice = stock.currentPrice;
    const totalCost = parseFloat((currentPrice * quantity).toFixed(2));

    const user = await User.findById(userId).session(session);
    if (!user) throw new ApiError(404, 'User not found');
    if (user.virtualBalance < totalCost) {
      throw new ApiError(400, `Insufficient balance. Required: $${totalCost.toFixed(2)}, Available: $${user.virtualBalance.toFixed(2)}`);
    }

    user.virtualBalance = parseFloat((user.virtualBalance - totalCost).toFixed(2));
    await user.save({ session });

    let holding = await Portfolio.findOne({ user: userId, stock: stockId }).session(session);
    if (holding) {
      const newTotalInvested = holding.totalInvested + totalCost;
      const newQuantity = holding.quantity + quantity;
      holding.averageBuyPrice = parseFloat((newTotalInvested / newQuantity).toFixed(2));
      holding.quantity = newQuantity;
      holding.totalInvested = parseFloat(newTotalInvested.toFixed(2));
    } else {
      holding = new Portfolio({
        user: userId,
        stock: stockId,
        quantity,
        averageBuyPrice: currentPrice,
        totalInvested: totalCost,
      });
    }
    await holding.save({ session });

    const transaction = new Transaction({
      user: userId,
      stock: stockId,
      type: 'BUY',
      quantity,
      pricePerShare: currentPrice,
      totalAmount: totalCost,
      balanceAfter: user.virtualBalance,
    });
    await transaction.save({ session });

    await session.commitTransaction();

    await transaction.populate('stock', 'symbol name currentPrice');

    return {
      transaction,
      holding,
      newBalance: user.virtualBalance,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const sellStock = async (userId, stockId, quantity) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const stock = await Stock.findById(stockId).session(session);
    if (!stock) throw new ApiError(404, 'Stock not found');

    const holding = await Portfolio.findOne({ user: userId, stock: stockId }).session(session);
    if (!holding) throw new ApiError(400, 'You do not own this stock');
    if (holding.quantity < quantity) {
      throw new ApiError(400, `Insufficient shares. Owned: ${holding.quantity}, Requested: ${quantity}`);
    }

    const currentPrice = stock.currentPrice;
    const totalRevenue = parseFloat((currentPrice * quantity).toFixed(2));

    const profitLoss = parseFloat(((currentPrice - holding.averageBuyPrice) * quantity).toFixed(2));

    const user = await User.findById(userId).session(session);
    user.virtualBalance = parseFloat((user.virtualBalance + totalRevenue).toFixed(2));
    await user.save({ session });

    holding.quantity -= quantity;
    holding.totalInvested = parseFloat((holding.totalInvested - holding.averageBuyPrice * quantity).toFixed(2));

    if (holding.quantity === 0) {
      await Portfolio.deleteOne({ _id: holding._id }).session(session);
    } else {
      await holding.save({ session });
    }

    const transaction = new Transaction({
      user: userId,
      stock: stockId,
      type: 'SELL',
      quantity,
      pricePerShare: currentPrice,
      totalAmount: totalRevenue,
      balanceAfter: user.virtualBalance,
      profitLoss,
    });
    await transaction.save({ session });

    await session.commitTransaction();

    await transaction.populate('stock', 'symbol name currentPrice');

    return {
      transaction,
      profitLoss,
      newBalance: user.virtualBalance,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = { buyStock, sellStock };