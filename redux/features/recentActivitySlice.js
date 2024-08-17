import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activities: [],
  isLoading: false,
  error: null,
};

export const recentActivitySlice = createSlice({
  name: "recentActivity",
  initialState,
  reducers: {
    fetchActivitiesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchActivitiesSuccess: (state, action) => {
      state.activities = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchActivitiesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createActivity: (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.activities.push(action.payload); // Add the new activity to the activities array
    },
  },
});

export const { fetchActivitiesStart, fetchActivitiesSuccess, fetchActivitiesFailure,createActivity } = recentActivitySlice.actions;
export default recentActivitySlice.reducer;