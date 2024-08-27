import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  opportunities: [],
  totalOpportunities: 0,
  currentPage: 1,
  totalPages: 1,
  stagesCount: {
    closed_won: 0,
    closed_lost: 0,
  },
  isLoading: false,
  error: null,
};

export const ielice = createSlice({
  name: "opportunity",
  initialState,
  reducers: {
    fetchOpportunitiesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOpportunitiesSuccess: (state, action) => {
      state.opportunities = action.payload.opportunities;
      state.totalOpportunities = action.payload.totalOpportunities
      state.currentPage = action.payload.currentPage
      state.totalPages = action.payload.totalPages
      state.stagesCount.closed_won = action.payload?.stagesCount[0]?.count
      // state.stagesCount.closed_lost = action.payload?.stagesCount[1]?.count
      state.isLoading = false;
      state.error = null;
    },
    fetchOpportunitiesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addOpportunity: (state, action) => {
      state.isLoading = false;
      state.error = null;

      // Add the new opportunity to the beginning of the array
      state.opportunities.unshift(action.payload);

      // If the array exceeds its original size, remove the last item
      if (state.opportunities.length > 10) {
        state.opportunities.pop();
      }
    },
    addMoreOpportunities: (state, action) => {
      const newOpportunities = action.payload;
      state.opportunities = [...state.opportunities, ...newOpportunities.opportunities];
    },
    deleteOpportunity: (state, action) => {
      const opportunityId = action.payload;

      // Find the index of the opportunity to delete
      const index = state.opportunities.findIndex(opportunity => opportunity._id === opportunityId);

      if (index !== -1) {
        const opportunityToDelete = state.opportunities[index];

        // Update status counts
        if (opportunityToDelete.stage === 'Closed Won') {
          state.stagesCount.closed_won -= 1;
        }

        // Remove the opportunity from the list and update total count
        state.opportunities.splice(index, 1);
        state.totalOpportunities -= 1;
      }
    },
    onPageChange: (state, action) => {
      const currentPageNumber = action.payload;
      state.currentPage = Math.max(1, Math.min(currentPageNumber, state.totalPages));
    },
    saveOpportunityUpdate: (state, action) => {
      const updatedOpportunity = action.payload;
      state.opportunities = state.opportunities.map((opportunity) =>
        opportunity._id === updatedOpportunity._id ? updatedOpportunity : opportunity
      );
    },
  },
});

export const { fetchOpportunitiesStart,
  fetchOpportunitiesSuccess,
  fetchOpportunitiesFailure,
  addOpportunity,
  addMoreOpportunities,
  onPageChange,
  deleteOpportunity,
  saveOpportunityUpdate,
} = ielice.actions;
export default ielice.reducer;