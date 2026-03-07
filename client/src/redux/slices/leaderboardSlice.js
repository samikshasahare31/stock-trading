import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLeaderboard as getLeaderboardApi } from '../../api/leaderboardApi';

export const fetchLeaderboard = createAsyncThunk('leaderboard/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getLeaderboardApi();
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
  }
});

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => { state.loading = true; })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => { 
        state.loading = false; 
        state.users = action.payload.users || [];
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      });
  },
});

export default leaderboardSlice.reducer;
