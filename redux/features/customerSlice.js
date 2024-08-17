import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [],
  totalCustomers: 0,
  currentPage: 1,
  totalPages: 1,
  statusesCount: {
    active: 0,
    inActive: 0,
  },
  isLoading: false,
  error: null,
};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    fetchCustomersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCustomersSuccess: (state, action) => {
      state.customers = action.payload.customers;
      state.totalCustomers = action.payload.totalCustomers
      state.currentPage = action.payload.currentPage
      state.totalPages = action.payload.totalPages
      state.statusesCount.active = action.payload.statusesCount[0]?.count
      state.statusesCount.inActive = action.payload.statusesCount[1]?.count
      state.isLoading = false;
      state.error = null;
    },
    addMoreCustomers: (state, action) => {
      const newCustomers = action.payload;

      state.customers = [...state.customers, ...newCustomers.customers];
    },
    fetchCustomersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addCustomer: (state, action) => {
      state.isLoading = false;
      state.error = null;

      // Add the new opportunity to the beginning of the array
      state.customers.unshift(action.payload);

      // If the array exceeds its original size, remove the last item
      if (state.customers.length > 10) {
        state.customers.pop();
      }
    },
    saveCustomerUpdate: (state, action) => {
      const updatedCustomer = action.payload;

      state.customers = state.customers.map((customer) =>
        customer._id === updatedCustomer._id ? updatedCustomer : customer
      );
    },
    deleteCustomer: (state, action) => {
      const customerId = action.payload;

      // Find the index of the customer to delete
      const index = state.customers.findIndex(customer => customer._id === customerId);

      if (index !== -1) {
        const customerToDelete = state.customers[index];

        // Update status counts
        if (customerToDelete.status === 'Active') {
          state.statusesCount.active -= 1;
        } else {
          state.statusesCount.inActive -= 1;
        }

        // Remove the customer from the list and update total count
        state.customers.splice(index, 1);
        state.totalCustomers -= 1;
      }
    },
    onPageChange: (state, action) => {
      const currentPageNumber = action.payload;
      state.currentPage = Math.max(1, Math.min(currentPageNumber, state.totalPages));
    },
  },
});

export const {
  addCustomer,
  onPageChange,
  deleteCustomer,
  addMoreCustomers,
  saveCustomerUpdate,
  fetchCustomersStart,
  fetchCustomersSuccess,
  fetchCustomersFailure,
} = customerSlice.actions;
export default customerSlice.reducer;