import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { authApi } from '../../api/authApi';

const dummyToken = 'dummy-jwt-token-abc123';
const dummyUser = {
  _id: 'user1',
  name: 'Demo User',
  email: 'demo@sbstocks.com',
  role: 'user',
  virtualBalance: 100000,
  createdAt: '2025-01-15T10:00:00.000Z',
};

export const register = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    localStorage.setItem('token', dummyToken);
    return { user: { ...dummyUser, name: formData.name, email: formData.email }, token: dummyToken };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    localStorage.setItem('token', dummyToken);
    return { user: { ...dummyUser, email: credentials.email }, token: dummyToken };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    return dummyUser;
  } catch (error) {
    localStorage.removeItem('token');
    return rejectWithValue('Session expired');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: !!localStorage.getItem('token'),
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateBalance: (state, action) => {
      if (state.user) {
        state.user.virtualBalance = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUser.pending, (state) => { state.loading = true; })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError, updateBalance } = authSlice.actions;
export default authSlice.reducer;
