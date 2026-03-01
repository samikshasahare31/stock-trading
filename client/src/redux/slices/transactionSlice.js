import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { transactionApi } from '../../api/transactionApi';

const dummyTransactions = [
  { _id: 't1', type: 'BUY', stock: { symbol: 'AAPL' }, symbol: 'AAPL', quantity: 10, price: 175.50, totalAmount: 1755.00, balanceAfter: 98245.00, profitLoss: null, createdAt: '2025-12-15T09:30:00.000Z' },
  { _id: 't2', type: 'BUY', stock: { symbol: 'MSFT' }, symbol: 'MSFT', quantity: 8, price: 350.20, totalAmount: 2801.60, balanceAfter: 95443.40, profitLoss: null, createdAt: '2025-12-18T10:15:00.000Z' },
  { _id: 't3', type: 'BUY', stock: { symbol: 'NVDA' }, symbol: 'NVDA', quantity: 5, price: 820.00, totalAmount: 4100.00, balanceAfter: 91343.40, profitLoss: null, createdAt: '2026-01-05T11:00:00.000Z' },
  { _id: 't4', type: 'BUY', stock: { symbol: 'AMZN' }, symbol: 'AMZN', quantity: 12, price: 165.40, totalAmount: 1984.80, balanceAfter: 89358.60, profitLoss: null, createdAt: '2026-01-10T14:20:00.000Z' },
  { _id: 't5', type: 'SELL', stock: { symbol: 'AAPL' }, symbol: 'AAPL', quantity: 5, price: 185.00, totalAmount: 925.00, balanceAfter: 90283.60, profitLoss: 47.50, createdAt: '2026-01-20T15:45:00.000Z' },
  { _id: 't6', type: 'BUY', stock: { symbol: 'V' }, symbol: 'V', quantity: 10, price: 270.60, totalAmount: 2706.00, balanceAfter: 87577.60, profitLoss: null, createdAt: '2026-02-01T09:00:00.000Z' },
  { _id: 't7', type: 'BUY', stock: { symbol: 'AAPL' }, symbol: 'AAPL', quantity: 10, price: 182.30, totalAmount: 1823.00, balanceAfter: 85754.60, profitLoss: null, createdAt: '2026-02-05T10:30:00.000Z' },
  { _id: 't8', type: 'SELL', stock: { symbol: 'MSFT' }, symbol: 'MSFT', quantity: 3, price: 375.00, totalAmount: 1125.00, balanceAfter: 86879.60, profitLoss: 74.40, createdAt: '2026-02-10T13:00:00.000Z' },
  { _id: 't9', type: 'BUY', stock: { symbol: 'GOOGL' }, symbol: 'GOOGL', quantity: 7, price: 139.50, totalAmount: 976.50, balanceAfter: 85903.10, profitLoss: null, createdAt: '2026-02-15T11:45:00.000Z' },
  { _id: 't10', type: 'SELL', stock: { symbol: 'NVDA' }, symbol: 'NVDA', quantity: 2, price: 870.00, totalAmount: 1740.00, balanceAfter: 87643.10, profitLoss: 100.00, createdAt: '2026-02-20T14:30:00.000Z' },
  { _id: 't11', type: 'BUY', stock: { symbol: 'TSLA' }, symbol: 'TSLA', quantity: 6, price: 245.80, totalAmount: 1474.80, balanceAfter: 86168.30, profitLoss: null, createdAt: '2026-02-22T10:00:00.000Z' },
  { _id: 't12', type: 'SELL', stock: { symbol: 'AMZN' }, symbol: 'AMZN', quantity: 4, price: 176.90, totalAmount: 707.60, balanceAfter: 86875.90, profitLoss: 46.00, createdAt: '2026-02-25T16:00:00.000Z' },
];

export const buyStock = createAsyncThunk('transactions/buy', async ({ stockId, quantity }, { rejectWithValue }) => {
  try {
    // const { data } = await transactionApi.buy(stockId, quantity);
    // return data.data;
    return {
      transaction: { _id: 'new-buy', type: 'BUY', stockId, quantity, price: 100, totalAmount: 100 * quantity },
      newBalance: 85000,
    };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Buy failed');
  }
});

export const sellStock = createAsyncThunk('transactions/sell', async ({ stockId, quantity }, { rejectWithValue }) => {
  try {
    // const { data } = await transactionApi.sell(stockId, quantity);
    // return data.data;
    return {
      transaction: { _id: 'new-sell', type: 'SELL', stockId, quantity, price: 100, totalAmount: 100 * quantity },
      newBalance: 86000,
    };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Sell failed');
  }
});

export const fetchTransactions = createAsyncThunk('transactions/fetchHistory', async (params, { rejectWithValue }) => {
  try {
    // const { data } = await transactionApi.getHistory(params);
    // return data.data;
    let filtered = [...dummyTransactions];
    if (params?.type) {
      filtered = filtered.filter((t) => t.type === params.type);
    }
    const page = params?.page || 1;
    const limit = params?.limit || 15;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);
    return {
      transactions: paged,
      pagination: { page, limit, total: filtered.length, pages: Math.ceil(filtered.length / limit) },
    };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
  }
});

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: [],
    pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    tradeLoading: false,
    historyLoading: false,
    error: null,
    lastTrade: null,
  },
  reducers: {
    clearTradeError: (state) => { state.error = null; },
    clearLastTrade: (state) => { state.lastTrade = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(buyStock.pending, (state) => { state.tradeLoading = true; state.error = null; })
      .addCase(buyStock.fulfilled, (state, action) => { state.tradeLoading = false; state.lastTrade = action.payload; })
      .addCase(buyStock.rejected, (state, action) => { state.tradeLoading = false; state.error = action.payload; })
      .addCase(sellStock.pending, (state) => { state.tradeLoading = true; state.error = null; })
      .addCase(sellStock.fulfilled, (state, action) => { state.tradeLoading = false; state.lastTrade = action.payload; })
      .addCase(sellStock.rejected, (state, action) => { state.tradeLoading = false; state.error = action.payload; })
      .addCase(fetchTransactions.pending, (state) => { state.historyLoading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.list = action.payload.transactions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => { state.historyLoading = false; state.error = action.payload; });
  },
});

export const { clearTradeError, clearLastTrade } = transactionSlice.actions;
export default transactionSlice.reducer;
