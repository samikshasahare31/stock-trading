import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stockApi } from '../../api/stockApi';

const mapStockFromApi = (stock) => {
  if (!stock) return stock;

  const price = stock.price ?? stock.currentPrice ?? 0;
  const change = stock.change ?? 0;

  return {
    ...stock,
    currentPrice: price,
    previousClose: price - change,
  };
};

export const fetchStocks = createAsyncThunk('stocks/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await stockApi.getAll(params);
    const stocksFromApi = data.stocks || data.data?.stocks || [];

    const stocks = stocksFromApi.map(mapStockFromApi);

    return {
      stocks,
      pagination: {
        page: 1,
        limit: stocks.length,
        total: stocks.length,
        pages: 1,
      },
    };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stocks');
  }
});

export const fetchStockDetail = createAsyncThunk('stocks/fetchDetail', async (symbol, { rejectWithValue }) => {
  try {
    const { data } = await stockApi.getBySymbol(symbol);
    const stockFromApi = data.stock || data.data?.stock;

    if (!stockFromApi) return rejectWithValue('Stock not found');

    return mapStockFromApi(stockFromApi);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stock');
  }
});

export const searchStocks = createAsyncThunk('stocks/search', async (query, { rejectWithValue }) => {
  try {
    const { data } = await stockApi.search(query);
    const stocksFromApi = data.stocks || data.data?.stocks || [];

    const stocks = stocksFromApi.map(mapStockFromApi);

    return { stocks };
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
      .addCase(searchStocks.fulfilled, (state, action) => { state.searchResults = action.payload.stocks; });
  },
});

export const { clearSelectedStock } = stockSlice.actions;
export default stockSlice.reducer;
