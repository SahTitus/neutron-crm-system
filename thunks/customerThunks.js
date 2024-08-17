import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCustomersFromApi } from "@server_actions/customer.action";

// Fetch customers with pagination
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async ({ page, pageSize }, thunkAPI) => {
    try {
      const response = await fetchCustomersFromApi(page, pageSize);
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
