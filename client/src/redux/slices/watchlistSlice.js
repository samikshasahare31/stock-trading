import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const dummyWatchlistStocks = [
  { _id: 's1', symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 189.84, previousClose: 187.39, sector: 'Technology' },
  { _id: 's2', symbol: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 141.80, previousClose: 142.75, sector: 'Technology' },
  { _id: 's5', symbol: 'TSLA', name: 'Tesla Inc.', currentPrice: 248.42, previousClose: 251.60, sector: 'Consumer' },
  { _id: 's18', symbol: 'NFLX', name: 'Netflix Inc.', currentPrice: 628.50, previousClose: 622.30, sector: 'Communication' },
  { _id: 's25', symbol: 'MA', name: 'Mastercard Inc.', currentPrice: 458.90, previousClose: 455.30, sector: 'Finance' },
];

export const fetchWatchlist = createAsyncThunk('watchlist/fetch', async (_, { rejectWithValue }) => {
  try {
  
    return { stocks: dummyWatchlistStocks };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch watchlist');
  }
});

export const addToWatchlist = createAsyncThunk('watchlist/add', async (stockId, { rejectWithValue }) => {
  try {
   
    const newStock = dummyWatchlistStocks.find((s) => s._id === stockId) || {
      _id: stockId, symbol: stockId.toUpperCase(), name: 'Unknown Stock', currentPrice: 100.00, previousClose: 99.00, sector: 'N/A',
    };
    return { stocks: [...dummyWatchlistStocks, newStock] };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add to watchlist');
  }
});

export const removeFromWatchlist = createAsyncThunk('watchlist/remove', async (stockId, { rejectWithValue }) => {
  try {
    return stockId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove');
  }
});

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: { stocks: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWatchlist.fulfilled, (state, action) => { state.loading = false; state.stocks = action.payload.stocks; })
      .addCase(fetchWatchlist.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addToWatchlist.fulfilled, (state, action) => { state.stocks = action.payload.stocks; })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.stocks = state.stocks.filter((s) => s._id !== action.payload);
      });
  },
});

export default watchlistSlice.reducer;
