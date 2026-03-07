import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getAdminUsers, 
  getAdminUser, 
  resetUserBalance, 
  addStock, 
  updateStock, 
  deleteStock, 
  getAdminStats 
} from '../../api/adminApi';

// Thunks
export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getAdminStats();
    return data.stats;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
  }
});

export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getAdminUsers();
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const fetchAdminUser = createAsyncThunk('admin/fetchUser', async (userId, { rejectWithValue }) => {
  try {
    const { data } = await getAdminUser(userId);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
  }
});

export const resetBalance = createAsyncThunk('admin/resetBalance', async (userId, { rejectWithValue }) => {
  try {
    const { data } = await resetUserBalance(userId);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to reset balance');
  }
});

export const createStock = createAsyncThunk('admin/createStock', async (stockData, { rejectWithValue }) => {
  try {
    const { data } = await addStock(stockData);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create stock');
  }
});

export const editStock = createAsyncThunk('admin/editStock', async ({ stockId, stockData }, { rejectWithValue }) => {
  try {
    const { data } = await updateStock(stockId, stockData);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update stock');
  }
});

export const deactivateStock = createAsyncThunk('admin/deactivateStock', async (stockId, { rejectWithValue }) => {
  try {
    const { data } = await deleteStock(stockId);
    return stockId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to deactivate stock');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    users: [],
    stocks: [],
    currentUser: null,
    loading: false,
    statsLoading: false,
    usersLoading: false,
    stocksLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchAdminStats.pending, (state) => { state.statsLoading = true; })
      .addCase(fetchAdminStats.fulfilled, (state, action) => { 
        state.statsLoading = false; 
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => { 
        state.statsLoading = false; 
        state.error = action.payload;
      })
      // Users
      .addCase(fetchAdminUsers.pending, (state) => { state.usersLoading = true; })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => { 
  state.usersLoading = false; 
  state.users = action.payload || [];
})
      .addCase(fetchAdminUsers.rejected, (state, action) => { 
        state.usersLoading = false; 
        state.error = action.payload;
      })
      // User Detail
      .addCase(fetchAdminUser.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.currentUser = action.payload;
      })
      .addCase(fetchAdminUser.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })
      // Reset Balance
      .addCase(resetBalance.fulfilled, (state, action) => {
        const userIndex = state.users.findIndex(u => u._id === action.payload._id);
        if (userIndex !== -1) {
          state.users[userIndex].balance = action.payload.balance;
        }
      })
      .addCase(resetBalance.rejected, (state, action) => { state.error = action.payload; })
      // Create Stock
      .addCase(createStock.pending, (state) => { state.stocksLoading = true; })
      .addCase(createStock.fulfilled, (state, action) => { 
        state.stocksLoading = false; 
        state.stocks.push(action.payload);
      })
      .addCase(createStock.rejected, (state, action) => { 
        state.stocksLoading = false; 
        state.error = action.payload;
      })
      // Edit Stock
      .addCase(editStock.pending, (state) => { state.stocksLoading = true; })
      .addCase(editStock.fulfilled, (state, action) => { 
        state.stocksLoading = false; 
        const stockIndex = state.stocks.findIndex(s => s._id === action.payload._id);
        if (stockIndex !== -1) {
          state.stocks[stockIndex] = action.payload;
        }
      })
      .addCase(editStock.rejected, (state, action) => { 
        state.stocksLoading = false; 
        state.error = action.payload;
      })
      // Deactivate Stock
      .addCase(deactivateStock.fulfilled, (state, action) => {
        state.stocks = state.stocks.filter(s => s._id !== action.payload);
      })
      .addCase(deactivateStock.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
