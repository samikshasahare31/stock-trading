import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { stockApi } from '../../api/stockApi';

const dummyStocks = [
  { _id: 's1', symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 189.84, previousClose: 187.39, sector: 'Technology', volume: 54320000, marketCap: 2940000000000, exchange: 'NASDAQ', dayHigh: 191.20, dayLow: 188.10, description: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.' },
  { _id: 's2', symbol: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 141.80, previousClose: 142.75, sector: 'Technology', volume: 23100000, marketCap: 1780000000000, exchange: 'NASDAQ', dayHigh: 143.50, dayLow: 140.90, description: 'Alphabet is a holding company that gives ambitious projects the resources, freedom, and focus to make their ideas happen.' },
  { _id: 's3', symbol: 'MSFT', name: 'Microsoft Corp.', currentPrice: 378.91, previousClose: 374.79, sector: 'Technology', volume: 19800000, marketCap: 2810000000000, exchange: 'NASDAQ', dayHigh: 380.25, dayLow: 375.60, description: 'Microsoft develops and supports software, services, devices, and solutions worldwide.' },
  { _id: 's4', symbol: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 178.25, previousClose: 176.65, sector: 'Consumer', volume: 42500000, marketCap: 1850000000000, exchange: 'NASDAQ', dayHigh: 179.80, dayLow: 176.20, description: 'Amazon engages in the retail sale of consumer products, advertising, and subscription services.' },
  { _id: 's5', symbol: 'TSLA', name: 'Tesla Inc.', currentPrice: 248.42, previousClose: 251.60, sector: 'Consumer', volume: 98700000, marketCap: 790000000000, exchange: 'NASDAQ', dayHigh: 253.10, dayLow: 246.80, description: 'Tesla designs, develops, manufactures, and sells electric vehicles and energy generation and storage systems.' },
  { _id: 's6', symbol: 'META', name: 'Meta Platforms Inc.', currentPrice: 505.75, previousClose: 501.20, sector: 'Technology', volume: 17200000, marketCap: 1290000000000, exchange: 'NASDAQ', dayHigh: 508.30, dayLow: 500.50, description: 'Meta builds technologies that help people connect, find communities, and grow businesses.' },
  { _id: 's7', symbol: 'NVDA', name: 'NVIDIA Corp.', currentPrice: 875.30, previousClose: 860.12, sector: 'Technology', volume: 38900000, marketCap: 2160000000000, exchange: 'NASDAQ', dayHigh: 880.50, dayLow: 862.40, description: 'NVIDIA provides graphics and compute solutions for gaming, professional visualization, data center, and automotive markets.' },
  { _id: 's8', symbol: 'JPM', name: 'JPMorgan Chase & Co.', currentPrice: 198.50, previousClose: 196.80, sector: 'Finance', volume: 9800000, marketCap: 572000000000, exchange: 'NYSE', dayHigh: 199.60, dayLow: 196.30, description: 'JPMorgan Chase is a global financial services firm and one of the largest banking institutions in the United States.' },
  { _id: 's9', symbol: 'V', name: 'Visa Inc.', currentPrice: 281.30, previousClose: 279.45, sector: 'Finance', volume: 6200000, marketCap: 577000000000, exchange: 'NYSE', dayHigh: 282.80, dayLow: 278.90, description: 'Visa operates a global payments technology company that enables digital payments.' },
  { _id: 's10', symbol: 'JNJ', name: 'Johnson & Johnson', currentPrice: 156.20, previousClose: 157.85, sector: 'Healthcare', volume: 7100000, marketCap: 376000000000, exchange: 'NYSE', dayHigh: 158.10, dayLow: 155.40, description: 'Johnson & Johnson researches, develops, manufactures, and sells various products in the healthcare field.' },
  { _id: 's11', symbol: 'WMT', name: 'Walmart Inc.', currentPrice: 165.80, previousClose: 164.20, sector: 'Consumer', volume: 8500000, marketCap: 446000000000, exchange: 'NYSE', dayHigh: 166.50, dayLow: 163.80, description: 'Walmart operates retail, wholesale, and other units worldwide.' },
  { _id: 's12', symbol: 'PG', name: 'Procter & Gamble Co.', currentPrice: 162.45, previousClose: 163.10, sector: 'Consumer', volume: 5900000, marketCap: 383000000000, exchange: 'NYSE', dayHigh: 163.80, dayLow: 161.70, description: 'Procter & Gamble provides branded consumer packaged goods worldwide.' },
  { _id: 's13', symbol: 'UNH', name: 'UnitedHealth Group', currentPrice: 524.60, previousClose: 520.30, sector: 'Healthcare', volume: 3400000, marketCap: 484000000000, exchange: 'NYSE', dayHigh: 527.40, dayLow: 519.80, description: 'UnitedHealth Group operates as a diversified healthcare company in the United States.' },
  { _id: 's14', symbol: 'HD', name: 'Home Depot Inc.', currentPrice: 345.20, previousClose: 342.75, sector: 'Consumer', volume: 4100000, marketCap: 344000000000, exchange: 'NYSE', dayHigh: 347.10, dayLow: 341.50, description: 'Home Depot operates as a home improvement retailer.' },
  { _id: 's15', symbol: 'BAC', name: 'Bank of America Corp.', currentPrice: 34.85, previousClose: 35.20, sector: 'Finance', volume: 32100000, marketCap: 274000000000, exchange: 'NYSE', dayHigh: 35.40, dayLow: 34.60, description: 'Bank of America provides banking and financial products and services worldwide.' },
  { _id: 's16', symbol: 'XOM', name: 'Exxon Mobil Corp.', currentPrice: 104.30, previousClose: 103.50, sector: 'Energy', volume: 14200000, marketCap: 416000000000, exchange: 'NYSE', dayHigh: 105.10, dayLow: 103.20, description: 'Exxon Mobil explores for and produces crude oil and natural gas worldwide.' },
  { _id: 's17', symbol: 'DIS', name: 'Walt Disney Co.', currentPrice: 112.45, previousClose: 114.10, sector: 'Communication', volume: 11300000, marketCap: 206000000000, exchange: 'NYSE', dayHigh: 114.80, dayLow: 111.90, description: 'The Walt Disney Company operates as an entertainment company worldwide.' },
  { _id: 's18', symbol: 'NFLX', name: 'Netflix Inc.', currentPrice: 628.50, previousClose: 622.30, sector: 'Communication', volume: 5800000, marketCap: 272000000000, exchange: 'NASDAQ', dayHigh: 632.40, dayLow: 621.50, description: 'Netflix provides entertainment services and is one of the leading streaming platforms.' },
  { _id: 's19', symbol: 'ADBE', name: 'Adobe Inc.', currentPrice: 542.80, previousClose: 545.60, sector: 'Technology', volume: 3200000, marketCap: 243000000000, exchange: 'NASDAQ', dayHigh: 547.30, dayLow: 540.10, description: 'Adobe operates as a diversified software company worldwide.' },
  { _id: 's20', symbol: 'CRM', name: 'Salesforce Inc.', currentPrice: 272.15, previousClose: 269.80, sector: 'Technology', volume: 5600000, marketCap: 264000000000, exchange: 'NYSE', dayHigh: 274.20, dayLow: 268.90, description: 'Salesforce provides customer relationship management technology solutions.' },
  { _id: 's21', symbol: 'PFE', name: 'Pfizer Inc.', currentPrice: 28.45, previousClose: 28.90, sector: 'Healthcare', volume: 25800000, marketCap: 160000000000, exchange: 'NYSE', dayHigh: 29.10, dayLow: 28.20, description: 'Pfizer discovers, develops, manufactures, markets, and sells biopharmaceutical products worldwide.' },
  { _id: 's22', symbol: 'INTC', name: 'Intel Corp.', currentPrice: 31.20, previousClose: 30.85, sector: 'Technology', volume: 28400000, marketCap: 132000000000, exchange: 'NASDAQ', dayHigh: 31.80, dayLow: 30.60, description: 'Intel designs, manufactures, and sells computer products and technologies worldwide.' },
  { _id: 's23', symbol: 'KO', name: 'Coca-Cola Co.', currentPrice: 60.35, previousClose: 60.80, sector: 'Consumer', volume: 12600000, marketCap: 261000000000, exchange: 'NYSE', dayHigh: 61.10, dayLow: 59.90, description: 'The Coca-Cola Company manufactures, markets, and sells various nonalcoholic beverages worldwide.' },
  { _id: 's24', symbol: 'NKE', name: 'Nike Inc.', currentPrice: 98.70, previousClose: 97.40, sector: 'Consumer', volume: 8900000, marketCap: 149000000000, exchange: 'NYSE', dayHigh: 99.50, dayLow: 97.10, description: 'NIKE designs, develops, markets, and sells athletic footwear, apparel, equipment, and accessories worldwide.' },
  { _id: 's25', symbol: 'MA', name: 'Mastercard Inc.', currentPrice: 458.90, previousClose: 455.30, sector: 'Finance', volume: 3100000, marketCap: 428000000000, exchange: 'NYSE', dayHigh: 461.20, dayLow: 454.80, description: 'Mastercard operates as a technology company in the global payments industry.' },
];

export const fetchStocks = createAsyncThunk('stocks/fetchAll', async (params, { rejectWithValue }) => {
  try {
    // const { data } = await stockApi.getAll(params);
    // return data.data;
    return { stocks: dummyStocks, pagination: { page: 1, limit: 50, total: dummyStocks.length, pages: 1 } };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stocks');
  }
});

export const fetchStockDetail = createAsyncThunk('stocks/fetchDetail', async (symbol, { rejectWithValue }) => {
  try {
    // const { data } = await stockApi.getBySymbol(symbol);
    // return data.data;
    const stock = dummyStocks.find((s) => s.symbol === symbol);
    if (!stock) return rejectWithValue('Stock not found');
    return stock;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stock');
  }
});

export const searchStocks = createAsyncThunk('stocks/search', async (query, { rejectWithValue }) => {
  try {
    // const { data } = await stockApi.search(query);
    // return data.data;
    const q = query.toLowerCase();
    const results = dummyStocks.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
    return { stocks: results };
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
