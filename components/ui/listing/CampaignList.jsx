'use client'
import React, { useEffect, useState } from "react";
import { CampaignCard } from "../cards/CampaignCard";
import { Pagination } from "@components/common/Pagination";
import { useSelector } from "react-redux";
import { addMoreCampaigns, deleteCampaign, fetchCampaignsFailure, fetchCampaignsStart, onPageChange } from "@redux/features/campaignSlice";
import { useConfirmationModal } from "@hooks/useConfirmationModal";
import { useStateContext } from "@redux/StateProvider";
import { deleteCampaignFromDb, fetchCampaigns } from "@server_actions/campaign.action";
import { fetchFilters } from "@lib/constants/filters";
import { Toast } from "@components/common/Toast";

export const CampaignList = ({ campaigns, showPagination, currentPage, totalPages, dispatch }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedCampaignId, setSelectedCampaignId] = useState(null);
	const user = useSelector((state) => state.auth.user);


	const { toggleConfirmationModal, ConfirmationModal } = useConfirmationModal();
	const { setShowToast, setToastMsg, } = useStateContext();

	const handleMenuOpen = (event, id) => {
		setAnchorEl(event.currentTarget);
		setSelectedCampaignId(id);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedCampaignId(null); // Clear selected ID when menu closes
	};

	const handleDelete = async () => {
		if (!selectedCampaignId) return;
		toggleConfirmationModal("Are you sure you want to delete this item?", async () => {
			try {
				await deleteCampaignFromDb(selectedCampaignId, user?.id);

				dispatch(deleteCampaign(selectedCampaignId));
				setShowToast(true);
				setToastMsg(prevState => ({ ...prevState, message: 'Deleted successfully' }));
			} catch (error) {
				dispatch(fetchCampaignsFailure(selectedCampaignId));
				setShowToast(true);
				setToastMsg({ isError: true, message: 'Deletion was unsuccessful' });
			}
		}, "bg-red-600 hover:bg-red-700");
		handleMenuClose(); // Close the menu after the delete action
	};

	useEffect(() => {
		// Fetch Campaigns whenever currentPage changes
		const fetchCampaignsData = async () => {
			try {
				dispatch(fetchCampaignsStart(currentPage));
			} catch (error) {
				dispatch(fetchCampaignsFailure(error.message));
				setShowToast(true);
				setToastMsg({ isError: true, message: 'Failed to fetch Campaigns' });
			}
		};

		fetchCampaignsData();
	}, [currentPage, dispatch]);

	const handlePageChange = async (pageChange) => {
		let page = pageChange === "+ve" ? ++currentPage : --currentPage;

		// Ensure newPage is within the valid range
		page = Math.max(1, Math.min(page, totalPages));

		dispatch(onPageChange(page)); // Update the currentPage in the store

		if ((pageChange === '+ve') && (page < totalPages)) {

			const response = await fetchCampaigns({}, { ...fetchFilters.options, page: page }, user?.companyId);

			dispatch(addMoreCampaigns(response))
		}
	};

	return (
		<section className="p-6 space-y-6 w-full rounded-2xl bg-gray-50 dark:bg-[#121826] transition-colors duration-500">
			<Toast styles='fixed top-10 left-1/2' />

			{campaigns.map((campaign) => (
				<CampaignCard
					key={campaign._id}
					campaign={campaign}
					anchorEl={anchorEl}
					isSearch={false}
					handleDelete={handleDelete}
					handleMenuOpen={handleMenuOpen}
					handleMenuClose={handleMenuClose}
				/>
			))}

			{showPagination && <Pagination
				currentPage={currentPage}
				dispatch={dispatch}
				handlePageChange={handlePageChange}
				totalPages={totalPages}
			/>}

			<ConfirmationModal />
		</section>
	);
};