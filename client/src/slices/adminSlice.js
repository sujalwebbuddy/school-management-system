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

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    usersApproved: {},
    usersNotApproved: {},
    classrooms: { classes: [] },
    errors: null,
  },

  extraReducers: {
    [getApprovedUsers.fulfilled]: (state, action) => {
      state.usersApproved = action.payload;
      state.errors = null;
    },
    [getApprovedUsers.rejected]: (state, action) => {
      state.errors = action.payload;
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
  },
});
export default adminSlice.reducer;
