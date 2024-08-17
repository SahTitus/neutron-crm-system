import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],
  metrics: {
    currentMonthCount: 0,
    changePercentage: 0,
    hasChangeInc: false,
    totalCount: 0,
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
  },
  totalCampaigns: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
};

export const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    fetchCampaignsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCampaignsSuccess: (state, action) => {
      state.error = null;
      state.isLoading = false;

      state.campaigns = action.payload.campaigns;
      state.totalPages = action.payload.totalPages
      state.currentPage = action.payload.currentPage
      state.totalCampaigns = action.payload.totalCampaigns
      state.metrics = action.payload.campaignsMetrics;
    },
    fetchCampaignsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addCampaign: (state, action) => {
      state.isLoading = false;
      state.error = null;

      // Add the new opportunity to the beginning of the array
      state.campaigns.unshift(action.payload);
    },
    addMoreCampaigns: (state, action) => {
      const newCampaigns = action.payload;
      state.campaigns = [...state.campaigns, ...newCampaigns.campaigns];
    },
    onPageChange: (state, action) => {
      const currentPageNumber = action.payload;
      state.currentPage = Math.max(1, Math.min(currentPageNumber, state.totalPages));
    },
    deleteCampaign: (state, action) => {
      const campaignId = action.payload;

      // Find the index of the Campaign to delete
      const index = state.campaigns.findIndex(campaign => campaign._id === campaignId);

      if (index !== -1) {
        const campaignToDelete = state.campaigns[index];

        // Update metrics values
        state.metrics.totalClicked -= campaignToDelete.click_count
        state.metrics.totalOpened -= campaignToDelete.open_count
        state.metrics.totalSent -= campaignToDelete.sent_count

        // Remove the campaign from the list and update total count
        state.campaigns.splice(index, 1);
        state.totalCampaigns -= 1;
        state.metrics.totalCount -= 1
      }
    },
  },
});

export const {
  addCampaign,
  onPageChange,
  deleteCampaign,
  addMoreCampaigns,
  fetchCampaignsStart,
  fetchCampaignsSuccess,
  fetchCampaignsFailure,
} = campaignSlice.actions;
export default campaignSlice.reducer;