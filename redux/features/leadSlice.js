import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leads: [],
  totalLeads: 0,
  currentPage: 1,
  totalPages: 1,
  statusesCount: {
    closed_won: 0,
    closed_lost: 0,
  },
  isLoading: false,
  error: null,
};

export const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    fetchLeadsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchLeadsSuccess: (state, action) => {
      state.leads = action.payload.leads;
      state.statusesCount.closed_won = action.payload?.statusesCount[0]?.count
      state.statusesCount.closed_lost = action.payload?.statusesCount[1]?.count
      state.totalLeads = action.payload.totalLeads
      state.currentPage = action.payload.currentPage
      state.totalPages = action.payload.totalPages

      state.isLoading = false;
      state.error = null;
    },
    fetchLeadsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addLead: (state, action) => {
      state.isLoading = false;
      state.error = null;

      // Add the new opportunity to the beginning of the array
      state.leads.unshift(action.payload);

      // If the array exceeds its original size, remove the last item
      if (state.leads.length > 10) {
        state.leads.pop();
      }
    },
    addMoreLeads: (state, action) => {
      const newLeads = action.payload;
      state.leads = [...state.leads, ...newLeads.leads];
    },
    deleteLead: (state, action) => {
      const leadId = action.payload;

      // Find the index of the lead to delete
      const index = state.leads.findIndex(lead => lead._id === leadId);

      if (index !== -1) {
        const leadToDelete = state.leads[index];

        // Update status counts
        if (leadToDelete.status === 'Closed Won') {
          state.statusesCount.closed_won -= 1;
        }

        // Remove the lead from the list and update total count
        state.leads.splice(index, 1);
        state.totalLeads -= 1;
      }
    },
    onPageChange: (state, action) => {
      const currentPageNumber = action.payload;
      state.currentPage = Math.max(1, Math.min(currentPageNumber, state.totalPages));
    },
    saveLeadUpdate: (state, action) => {
      const updatedLead = action.payload;

      state.leads = state.leads.map((lead) =>
        lead._id === updatedLead._id ? updatedLead : lead
      );
    },
  },
});

export const {
  addLead,
  deleteLead,
  addMoreLeads,
  onPageChange,
  saveLeadUpdate,
  fetchLeadsStart,
  fetchLeadsSuccess,
  fetchLeadsFailure,
} = leadSlice.actions;
export default leadSlice.reducer;