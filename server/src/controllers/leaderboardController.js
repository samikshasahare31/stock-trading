const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

// GET /api/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    // Aggregate portfolio value per user
    const portfolioValues = await Portfolio.aggregate([
      {
        $lookup: {
          from: 'stocks',
          localField: 'stock',
          foreignField: '_id',
          as: 'stockData',
        },
      },
      { $unwind: '$stockData' },
      {
        $group: {
          _id: '$user',
          portfolioValue: {
            $sum: { $multiply: ['$stockData.price', '$quantity'] },
          },
        },
      },
    ]);

    // Map portfolio values by userId
    const portfolioMap = {};
    portfolioValues.forEach((item) => {
      portfolioMap[item._id.toString()] = item.portfolioValue;
    });

    // Get all users
    const users = await User.find({ role: 'user' }).select('name email balance');

    // Build leaderboard
    const leaderboard = users
      .map((user) => ({
        userId: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        portfolioValue: +(portfolioMap[user._id.toString()] || 0).toFixed(2),
        totalValue: +(user.balance + (portfolioMap[user._id.toString()] || 0)).toFixed(2),
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .map((entry, index) => ({ rank: index + 1, ...entry }));

    res.json({ success: true, count: leaderboard.length, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLeaderboard };
