import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
  isLoading: false,
  error: null,
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    fetchEmployeesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchEmployeesSuccess: (state, action) => {
      state.employees = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchEmployeesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addEmployee: (state, action) => {
      state.isLoading = false;
      state.error = null;

      // Add the new opportunity to the beginning of the array
      state.employees.unshift(action.payload);

      // If the array exceeds its original size, remove the last item
      if (state.employees.length > 10) {
        state.employees.pop();
      }
    },
  },
});

export const { fetchEmployeesStart, fetchEmployeesSuccess, fetchEmployeesFailure, addEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;