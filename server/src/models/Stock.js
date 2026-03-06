const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Stock name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Stock price is required'],
      min: 0,
    },
    change: {
      type: Number,
      default: 0,
    },
    changePercent: {
      type: Number,
      default: 0,
    },
    sector: {
      type: String,
      trim: true,
      default: 'General',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', stockSchema);
