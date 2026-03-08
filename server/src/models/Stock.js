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
    currentPrice: {
      type: Number,
      min: 0,
      get: function(value) {
        return value !== undefined ? value : this.price;
      },
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

// Set currentPrice to price if not provided
stockSchema.pre('save', function(next) {
  if (!this.currentPrice) {
    this.currentPrice = this.price;
  }
  next();
});

module.exports = mongoose.model('Stock', stockSchema);
