import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export const getUserInfo = createAsyncThunk(
  "teacher/userinfo",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/userInfo", {
        params: { email: input?.email },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getClasses = createAsyncThunk(
  "teacher/classroom",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/class");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const myClass = createAsyncThunk(
  "teacher/teacherclass",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/teacher/myclass", {
        params: { subject: input },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getExams = createAsyncThunk(
  "teacher/exams",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/teacher/allexams", {
        params: { subject: input },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getHomeworks = createAsyncThunk(
  "teacher/homework",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/teacher/allhomeworks", {
        params: { subject: input },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const teacherSlice = createSlice({
  name: "teacher",
  initialState: {
    userInfo: {},
    classrooms: {},
    teacherclass: {},
    exams: {},
    homework: {},
    errors: null,
  },

  extraReducers: {
    [getUserInfo.fulfilled]: (state, action) => {
      state.userInfo = action.payload;
      state.errors = null;
    },
    [getUserInfo.rejected]: (state, action) => {
      state.errors = action.payload;
    },
    [getClasses.fulfilled]: (state, action) => {
      state.classrooms = action.payload;
      state.errors = null;
    },
    [getClasses.rejected]: (state, action) => {
      state.errors = action.payload;
    },
    [myClass.fulfilled]: (state, action) => {
      state.teacherclass = action.payload;
      state.errors = null;
    },
    [myClass.rejected]: (state, action) => {
      state.errors = action.payload;
    },
    [getExams.fulfilled]: (state, action) => {
      state.exams = action.payload;
      state.errors = null;
    },
    [getExams.rejected]: (state, action) => {
      state.errors = action.payload;
    },
    [getHomeworks.fulfilled]: (state, action) => {
      state.homework = action.payload;
      state.errors = null;
    },
    [getHomeworks.rejected]: (state, action) => {
      state.errors = action.payload;
    },
  },
});
export default teacherSlice.reducer;
