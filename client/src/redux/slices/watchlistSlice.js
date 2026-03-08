import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWatchlist as fetchWatchlistApi, addToWatchlist as addToWatchlistApi, removeFromWatchlist as removeFromWatchlistApi } from '../../api/watchlistApi';

export const fetchWatchlist = createAsyncThunk('watchlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await fetchWatchlistApi();
    // server returns { success, watchlist }
    return data.watchlist;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch watchlist');
  }
});

export const addToWatchlist = createAsyncThunk('watchlist/add', async (stockId, { rejectWithValue }) => {
  try {
    const { data } = await addToWatchlistApi(stockId);
    return { stockId };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add to watchlist');
  }
});

export const removeFromWatchlist = createAsyncThunk('watchlist/remove', async (stockId, { rejectWithValue }) => {
  try {
    await removeFromWatchlistApi(stockId);
    return stockId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove');
  }
});

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: { 
    stocks: [],
    loading: false, 
    error: null,
    statusMap: {} // Track which stocks are in watchlist
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWatchlist.fulfilled, (state, action) => { 
        state.loading = false;
        state.stocks = action.payload?.stocks || [];
      })
      .addCase(fetchWatchlist.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        // Mark stock as in watchlist
        if (!state.statusMap[action.payload?.stockId]) {
          state.statusMap[action.payload?.stockId] = true;
        }
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        // Mark stock as not in watchlist
        state.statusMap[action.payload] = false;
        // Remove from stocks array
        state.stocks = state.stocks.filter(s => s._id !== action.payload);
      });
  },
});

export default watchlistSlice.reducer;
