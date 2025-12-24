import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export const getApprovedUsers = createAsyncThunk(
  "admin/appUser",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/number");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getNoApprovedUsers = createAsyncThunk(
  "admin/NotappUser",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/pendedusers");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getClasses = createAsyncThunk(
  "admin/classroom",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/class");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDashboardAnalytics = createAsyncThunk(
  "admin/dashboardAnalytics",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/analytics/dashboard");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserRegistrationTrends = createAsyncThunk(
  "admin/registrationTrends",
  async (days = 30, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/analytics/registration-trends?days=${days}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSubscriptionAnalytics = createAsyncThunk(
  "admin/subscriptionAnalytics",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/analytics/subscription");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    usersApproved: {},
    usersNotApproved: {},
    classrooms: { classes: [] },
    dashboardAnalytics: null,
    registrationTrends: [],
    subscriptionAnalytics: null,
    errors: null,
    loading: false,
  },

  extraReducers: {
    [getApprovedUsers.fulfilled]: (state, action) => {
      state.usersApproved = action.payload;
      state.errors = null;
      state.loading = false;
    },
    [getApprovedUsers.rejected]: (state, action) => {
      state.errors = action.payload;
      state.loading = false;
    },
    [getNoApprovedUsers.fulfilled]: (state, action) => {
      state.usersNotApproved = action.payload;
      state.errors = null;
    },
    [getNoApprovedUsers.rejected]: (state, action) => {
      state.errors = action.payload;
    },
    [getClasses.fulfilled]: (state, action) => {
      state.classrooms = { classes: action.payload?.classes || [] };
      state.errors = null;
    },
    [getClasses.rejected]: (state, action) => {
      state.errors = action.payload;
    },
    [getDashboardAnalytics.pending]: (state) => {
      state.loading = true;
    },
    [getDashboardAnalytics.fulfilled]: (state, action) => {
      state.dashboardAnalytics = action.payload.data;
      state.errors = null;
      state.loading = false;
    },
    [getDashboardAnalytics.rejected]: (state, action) => {
      state.errors = action.payload;
      state.loading = false;
    },
    [getUserRegistrationTrends.fulfilled]: (state, action) => {
      state.registrationTrends = action.payload.data;
      state.errors = null;
    },
    [getUserRegistrationTrends.rejected]: (state, action) => {
      state.errors = action.payload;
    },
    [getSubscriptionAnalytics.fulfilled]: (state, action) => {
      state.subscriptionAnalytics = action.payload.data;
      state.errors = null;
    },
    [getSubscriptionAnalytics.rejected]: (state, action) => {
      state.errors = action.payload;
    },
  },
});
export default adminSlice.reducer;
