const Watchlist = require('../models/Watchlist');

// GET /api/watchlist
const getWatchlist = async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user._id })
      .populate('stocks', 'symbol name price currentPrice change changePercent');

      console.log("watchlist",watchlist)

    if (!watchlist) {
      watchlist = { stocks: [] };
    } else if (watchlist.stocks && watchlist.stocks.length) {
      // convert to plain objects and ensure numeric price/currentPrice
      watchlist.stocks = watchlist.stocks
        // .map((s) => {
        //   const obj = s.toObject ? s.toObject() : s;
        //   obj.currentPrice = obj.currentPrice ?? obj.price ?? 0;
        //   obj.price = obj.price ?? obj.currentPrice;
        //   return obj;
        // })
        // // remove any entry that somehow has no symbol
        // .filter((s) => s.symbol);
    }

    res.json({ success: true, watchlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/watchlist/add
const addToWatchlist = async (req, res) => {
  try {
    const { stockId } = req.body;
    if (!stockId) return res.status(400).json({ success: false, message: 'stockId is required.' });

    let watchlist = await Watchlist.findOne({ user: req.user._id });

    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user._id, stocks: [stockId] });
    } else {
      if (watchlist.stocks.includes(stockId))
        return res.status(400).json({ success: false, message: 'Stock already in watchlist.' });
      watchlist.stocks.push(stockId);
      await watchlist.save();
    }

    res.json({ success: true, message: 'Stock added to watchlist.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/watchlist/remove
const removeFromWatchlist = async (req, res) => {
  try {
    const { stockId } = req.body;
    if (!stockId) return res.status(400).json({ success: false, message: 'stockId is required.' });

    const watchlist = await Watchlist.findOne({ user: req.user._id });
    if (!watchlist) return res.status(404).json({ success: false, message: 'Watchlist not found.' });

    watchlist.stocks = watchlist.stocks.filter((id) => id.toString() !== stockId);
    await watchlist.save();

    res.json({ success: true, message: 'Stock removed from watchlist.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
