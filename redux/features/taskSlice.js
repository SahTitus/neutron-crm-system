import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    fetchTasksStart: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    fetchTasksSuccess: (state, action) => {
      state.error = null;
      state.isLoading = false;
      state.tasks = action.payload;
    },
    fetchTasksFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addTask: (state, action) => {
      state.isLoading = false;
      state.error = null;

      // Add the new opportunity to the beginning of the array
      state.tasks.unshift(action.payload);

      // If the array exceeds its original size, remove the last item
      if (state.tasks.length > 10) {
        state.tasks.pop();
      }
    },
  },
});

export const { fetchTasksStart, fetchTasksSuccess, fetchTasksFailure, addTask } = taskSlice.actions;
export default taskSlice.reducer;