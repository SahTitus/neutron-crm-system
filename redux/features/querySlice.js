import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	queryData: [],
	isLoading: false,
	error: null,
};

export const querySlice = createSlice({
	name: "query",
	initialState,
	reducers: {
		fetchQueryDataStart: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		fetchQueryDataSuccess: (state, action) => {
			state.error = null;
			state.isLoading = false;

			state.queryData = action.payload;
		},
		fetchQueryDataFailure: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},

		deleteQueryItem: (state, action) => {
			const queryItemId = action.payload;

			// Find the index of the queryItem to delete
			const index = state.queryData.findIndex(queryItem => queryItem._id === queryItemId);

			// Remove the queryItem from the list and update total count
			if (index !== -1) {
				state.queryData.splice(index, 1);
			}
		},
		saveQueryItemUpdate: (state, action) => {
			const updatedOpportunity = action.payload;
			state.opportunities = state.opportunities.map((opportunity) =>
				opportunity._id === updatedOpportunity._id ? updatedOpportunity : opportunity
			);
		},
	},
});

export const {
	deleteQueryItem,
	fetchQueryDataStart,
	saveQueryItemUpdate,
	fetchQueryDataSuccess,
	fetchQueryDataFailure,
} = querySlice.actions;
export default querySlice.reducer;