import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllStocks, getStockBySymbol, getStockById, searchStocks as searchStocksApi } from '../../api/stockApi';

export const fetchStocks = createAsyncThunk('stocks/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await getAllStocks(params);
    return { stocks: data.stocks, pagination: { page: 1, limit: 50, total: data.count, pages: Math.ceil(data.count / 50) } };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stocks');
  }
});

export const fetchStockDetail = createAsyncThunk('stocks/fetchDetail', async (symbol, { rejectWithValue }) => {
  try {
    const { data } = await getStockBySymbol(symbol);
    return data.stock;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stock');
  }
});

export const fetchStockById = createAsyncThunk('stocks/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await getStockById(id);
    return data.stock;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stock');
  }
});

export const searchStocks = createAsyncThunk('stocks/search', async (query, { rejectWithValue }) => {
  try {
    const { data } = await searchStocksApi(query);
    return { stocks: data.stocks };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Search failed');
  }
});

const stockSlice = createSlice({
  name: 'stocks',
  initialState: {
    list: [],
    searchResults: [],
    selectedStock: null,
    pagination: { page: 1, limit: 50, total: 0, pages: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedStock: (state) => { state.selectedStock = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.stocks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStocks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchStockDetail.pending, (state) => { state.loading = true; })
      .addCase(fetchStockDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStock = action.payload;
      })
      .addCase(fetchStockDetail.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchStockById.pending, (state) => { state.loading = true; })
      .addCase(fetchStockById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStock = action.payload;
      })
      .addCase(fetchStockById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(searchStocks.fulfilled, (state, action) => { state.searchResults = action.payload.stocks; });
  },
});

export const { clearSelectedStock } = stockSlice.actions;
export default stockSlice.reducer;
