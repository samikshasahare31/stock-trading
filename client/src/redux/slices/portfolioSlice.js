import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPortfolio, getPortfolioSummary } from '../../api/portfolioApi';

const dummyHoldings = [
  {
    _id: 'h1',
    stock: { _id: 's1', symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 189.84, sector: 'Technology' },
    quantity: 15,
    averageBuyPrice: 175.50,
    totalInvested: 2632.50,
    currentValue: 189.84 * 15,
  },
  {
    _id: 'h2',
    stock: { _id: 's3', symbol: 'MSFT', name: 'Microsoft Corp.', currentPrice: 378.91, sector: 'Technology' },
    quantity: 8,
    averageBuyPrice: 350.20,
    totalInvested: 2801.60,
    currentValue: 378.91 * 8,
  },
  {
    _id: 'h3',
    stock: { _id: 's7', symbol: 'NVDA', name: 'NVIDIA Corp.', currentPrice: 875.30, sector: 'Technology' },
    quantity: 5,
    averageBuyPrice: 820.00,
    totalInvested: 4100.00,
    currentValue: 875.30 * 5,
  },
  {
    _id: 'h4',
    stock: { _id: 's4', symbol: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 178.25, sector: 'Consumer' },
    quantity: 12,
    averageBuyPrice: 165.40,
    totalInvested: 1984.80,
    currentValue: 178.25 * 12,
  },
  {
    _id: 'h5',
    stock: { _id: 's9', symbol: 'V', name: 'Visa Inc.', currentPrice: 281.30, sector: 'Finance' },
    quantity: 10,
    averageBuyPrice: 270.60,
    totalInvested: 2706.00,
    currentValue: 281.30 * 10,
  },
];

const calcSummary = () => {
  const totalInvested = dummyHoldings.reduce((sum, h) => sum + h.totalInvested, 0);
  const totalCurrentValue = dummyHoldings.reduce((sum, h) => sum + h.stock.currentPrice * h.quantity, 0);
  const totalProfitLoss = totalCurrentValue - totalInvested;
  const virtualBalance = 100000 - totalInvested;
  return {
    virtualBalance,
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalPortfolioValue: virtualBalance + totalCurrentValue,
    overallReturn: totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0,
    holdingsCount: dummyHoldings.length,
  };
};

const dummySummary = calcSummary();

export const fetchPortfolio = createAsyncThunk('portfolio/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getPortfolio();
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch portfolio');
  }
});

export const fetchPortfolioSummary = createAsyncThunk('portfolio/fetchSummary', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getPortfolioSummary();
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary');
  }
});

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    holdings: [],
    summary: {
      virtualBalance: 0,
      totalInvested: 0,
      totalCurrentValue: 0,
      totalProfitLoss: 0,
      totalPortfolioValue: 0,
      overallReturn: 0,
      holdingsCount: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => { state.loading = true; })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.holdings = action.payload.holdings;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchPortfolioSummary.fulfilled, (state, action) => { state.summary = action.payload; });
  },
});

export default portfolioSlice.reducer;
