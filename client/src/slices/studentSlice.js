import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export const getUserInfo = createAsyncThunk(
  "student/userinfo",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/");
      return { user: res.data };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch user info");
    }
  }
);

export const getStudentClass = createAsyncThunk(
  "student/class",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/student/getStudentClass", {
        params: { classn: input },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTeachers = createAsyncThunk(
  "student/teacher",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/student/teachers");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getHomeworks = createAsyncThunk(
  "student/homework",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/student/homework", {
        params: { myclas: input },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getExam = createAsyncThunk(
  "student/exam",
  async (input, { rejectWithValue }) => {
    try {
      const res = await api.get("/student/exam", {
        params: { myclasss: input },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const studentSlice = createSlice({
  name: "student",
  initialState: {
    userInfo: {},
    myClass: {},
    teachers: {},
    homeworks: {},
    exams: {},
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
    [getStudentClass.fulfilled]: (state, action) => {
      state.myClass = action.payload;
      state.errors = null;
    },
    [getStudentClass.rejected]: (state, action) => {
      state.errors = action.payload;
    },
    [getTeachers.fulfilled]: (state, action) => {
      state.teachers = action.payload;
      state.errors = null;
    },
    [getTeachers.rejceted]: (state, action) => {
      state.errors = action.payload;
    },
    [getHomeworks.fulfilled]: (state, action) => {
      state.homeworks = action.payload;
      state.errors = null;
    },
    [getHomeworks.rejceted]: (state, action) => {
      state.errors = action.payload;
    },
    [getExam.fulfilled]: (state, action) => {
      state.exams = action.payload;
      state.errors = null;
    },
    [getExam.rejceted]: (state, action) => {
      state.errors = action.payload;
    },
  },
});

export default studentSlice.reducer;
