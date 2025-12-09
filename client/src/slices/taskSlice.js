import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Async thunks for task operations

// Get all tasks with optional filters
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await api.get(`/tasks?${queryParams}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get single task
export const fetchTask = createAsyncThunk(
  "tasks/fetchTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/tasks/${taskId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await api.post("/tasks", taskData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, taskData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update task status (for kanban drag and drop)
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/status`, { status });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/tasks/${taskId}`);
      return { taskId, ...res.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get task statistics
export const fetchTaskStats = createAsyncThunk(
  "tasks/fetchTaskStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/tasks/stats");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get tasks by assignee
export const fetchTasksByAssignee = createAsyncThunk(
  "tasks/fetchTasksByAssignee",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const queryParams = status ? `?status=${status}` : "";
      const res = await api.get(`/tasks/assignee/${userId}${queryParams}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    currentTask: null,
    stats: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
      pages: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    // Optimistic update for kanban drag and drop
    updateTaskStatusOptimistic: (state, action) => {
      const { taskId, status } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task._id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single task
      .addCase(fetchTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload.data;
        state.error = null;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload.data); // Add to beginning of list
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task._id === action.payload.data._id);
        if (index !== -1) {
          state.tasks[index] = action.payload.data;
        }
        if (state.currentTask && state.currentTask._id === action.payload.data._id) {
          state.currentTask = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update task status
      .addCase(updateTaskStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload.data._id);
        if (index !== -1) {
          state.tasks[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload;
        // Revert optimistic update on failure
        // This would need more complex logic to track previous state
      })

      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload.taskId);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch task stats
      .addCase(fetchTaskStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
        state.error = null;
      })
      .addCase(fetchTaskStats.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch tasks by assignee
      .addCase(fetchTasksByAssignee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByAssignee.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
        state.error = null;
      })
      .addCase(fetchTasksByAssignee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentTask, updateTaskStatusOptimistic } = taskSlice.actions;

// Selectors
export const selectTasks = (state) => state.tasks.tasks;
export const selectCurrentTask = (state) => state.tasks.currentTask;
export const selectTaskStats = (state) => state.tasks.stats;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;
export const selectTasksPagination = (state) => state.tasks.pagination;

// Selector to get tasks grouped by status (for kanban)
export const selectTasksByStatus = (state) => {
  const tasks = state.tasks.tasks;
  return {
    Open: tasks.filter(task => task.status === 'Open'),
    InProgress: tasks.filter(task => task.status === 'InProgress'),
    Testing: tasks.filter(task => task.status === 'Testing'),
    Close: tasks.filter(task => task.status === 'Close'),
  };
};

export default taskSlice.reducer;
