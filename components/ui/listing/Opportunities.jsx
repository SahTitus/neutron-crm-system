"use client";
import { useEffect, useState } from 'react';
import { Call, Email, MoreVert } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { stageColors } from '@lib/constants/optionValues';
import { addMoreOpportunities, deleteOpportunity, fetchOpportunitiesFailure, fetchOpportunitiesStart, onPageChange, } from '@redux/features/opportunitySlice';
import { Pagination } from '@components/common/Pagination';
import Link from 'next/link';
import { routes } from '@lib/routes';
import Image from 'next/image';
import { useConfirmationModal } from '@hooks/useConfirmationModal';
import { Toast } from '@components/common/Toast';
import { deleteOpportunityFromDb, fetchOpportunities } from '@server_actions/opportunity.action';
import { useStateContext } from '@redux/StateProvider';
import { useSelector } from 'react-redux';
import { fetchFilters } from '@lib/constants/filters';
import { ExportFileButton } from '@components/features/ExportFileButton';
import { formatDate } from '@utils/helpers/formatDate';
import { handleOpenCampaignModal } from '@utils/helpers';


export const OpportunitiesList = ({ showPagination, opportunities, currentPage, totalPages, dispatch }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
	const user = useSelector((state) => state.auth.user);

	const { toggleConfirmationModal, ConfirmationModal } = useConfirmationModal();
	const { setRecepientEmail, setShowToast, setToastMsg, setFormType, toggleSideModal, setFormItemToEdit } = useStateContext();

	const handleMenuOpen = (event, id) => {
		setAnchorEl(event.currentTarget);
		setSelectedOpportunityId(id);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedOpportunityId(null); // Clear selected ID when menu closes
	};

	// Assign stage background colors
	const updatedOpportunities = opportunities?.map(opportunity => {
		const matchedStage = stageColors.find(sc => sc.stage === opportunity.stage);
		return {
			...opportunity,
			stageColor: ' bg-red-200 text-red-800',
			// stageColor: matchedStage?.stageColor || ' bg-red-200 text-red-800',
		};
	});

	const handleDelete = async () => {
		if (!selectedOpportunityId) return;
		toggleConfirmationModal("Are you sure you want to delete this item?", async () => {
			try {
				await deleteOpportunityFromDb(selectedOpportunityId, user?.id);

				dispatch(deleteOpportunity(selectedOpportunityId));
				setShowToast(true);
				setToastMsg(prevState => ({ ...prevState, message: 'Deleted successfully' }));
			} catch (error) {
				dispatch(fetchOpportunitiesFailure(selectedOpportunityId));
				setShowToast(true);
				setToastMsg({ isError: true, message: 'Deletion was unsuccessful' });
			}
		}, "bg-red-600 hover:bg-red-700");
		handleMenuClose(); // Close the menu after the delete action
	};

	const handleEdit = async () => {
		if (!selectedOpportunityId) return;
		toggleConfirmationModal("Are you sure you want to edit this item?", async () => {
			setFormType('opportunity');

			const seletedItem = opportunities?.find(item => item?._id === selectedOpportunityId)
			setFormItemToEdit(seletedItem)
			toggleSideModal('dynamicForm')
		}, "bg-green-500 hover:bg-green-600")
		handleMenuClose(); // Close the menu after the edit action
	};

	useEffect(() => {
		// Fetch Opportunities whenever currentPage changes
		const fetchOpportunitiesData = async () => {
			try {
				dispatch(fetchOpportunitiesStart(currentPage));
			} catch (error) {
				dispatch(fetchOpportunitiesFailure(error.message));
				setShowToast(true);
				setToastMsg({ isError: true, message: 'Failed to fetch Opportunities' });
			}
		};

		fetchOpportunitiesData();
	}, [currentPage, dispatch]);

	const handlePageChange = async (pageChange) => {
		let page = pageChange === "+ve" ? ++currentPage : --currentPage;

		// Ensure newPage is within the valid range
		page = Math.max(1, Math.min(page, totalPages));

		dispatch(onPageChange(page)); // Update the currentPage in the store

		if ((pageChange === '+ve') && (page < totalPages)) {

			const response = await fetchOpportunities({}, { ...fetchFilters.options, page: page }, user?.companyId);

			dispatch(addMoreOpportunities(response))
		}
	};

	return (
		<div className="flex flex-col p-4 bg-white dark:bg-gray-900 rounded-lg shadow text-gray-800 dark:text-gray-400">
			<Toast styles='fixed top-10 left-1/2' />

			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-800 dark:text-slate-200">Opportunities</h2>
				{showPagination ? (
					<ExportFileButton
						data={updatedOpportunities}
						pathname='Opportunities'
						querySelectorForImg='table'
					/>) : (
					<Link href={`${routes.sales}/#opportunities`} className="bg-orange-300 text-gray-800 p-2 rounded-md hover:bg-orange-200">
						View more
					</Link>
				)}
			</div>

			<div className="relative overflow-x-auto py-4 w-full box-border custom-scrollbar">
				<table className="w-full bg-white dark:bg-gray-900 table-fixed">
					<thead>
						<tr>
							<th className="w-20 text-left bg-white dark:bg-gray-800 px-4 py-2">Image</th>
							<th className="w-52 text-left bg-white dark:bg-gray-800 px-4 py-2">Name</th>
							<th className="w-72 text-left bg-white dark:bg-gray-800 px-4 py-2">Email</th>
							<th className="w-44 text-left bg-white dark:bg-gray-800 px-4 py-2">Amount (GHS)</th>
							<th className="w-40 text-left bg-white dark:bg-gray-800 px-4 py-2">Stage</th>
							<th className="w-24 text-left bg-white dark:bg-gray-800 px-4 py-2">Probability</th>
							<th className="w-40 text-left bg-white dark:bg-gray-800 px-4 py-2">Phone</th>
							<th className="w-40 text-left bg-white dark:bg-gray-800 px-4 py-2">Close Date</th>
							<th className="w-36 text-left bg-white dark:bg-gray-800 px-4 py-2">Contact</th>
							<th className="w-20 text-left bg-white dark:bg-gray-800 px-4 py-2">Action</th>
						</tr>
					</thead>
					<tbody>
						{updatedOpportunities?.map((opportunity, index) => (
							<tr key={`${opportunity._id}+${index}`}>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">
									{!!opportunity?.image && <Image src={opportunity?.image} alt="avatar" width={40} height={40} className="rounded-full w-10 h-10" />}
								</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">{`${opportunity.firstName} ${opportunity.lastName}`}</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">{opportunity.email}</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">{opportunity.amount}</td>
								<td className=" py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">
									<span className={`flex justify-center px-4 py-1 rounded text-xs font-semibold ${opportunity.stageColor}`}>
										{opportunity.stage}
									</span>
								</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">
									{opportunity.probability}
								</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">
									{opportunity.phoneNumber}
								</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">{formatDate(opportunity.closeDate)}</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">
									<a aria-label="Telephone" href={`tel:${opportunity.phoneNumber}`} className="text-gray-200">
										<Call className="cursor-pointer" />
									</a>
									<Email
                                        onClick={() => handleOpenCampaignModal(setFormType, toggleSideModal, setRecepientEmail(opportunity?.email))}
                                        className="cursor-pointer mx-4"
                                    />
								</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b relative">
									<MoreVert className="cursor-pointer" onClick={(event) => handleMenuOpen(event, opportunity._id)} />
									<Menu
										anchorEl={anchorEl}
										open={Boolean(anchorEl)}
										onClose={handleMenuClose}
									>
										<MenuItem onClick={handleEdit}>Edit</MenuItem>
										<MenuItem onClick={handleDelete}>Delete</MenuItem>
									</Menu>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{showPagination && <Pagination
				currentPage={currentPage}
				dispatch={dispatch}
				handlePageChange={handlePageChange}
				totalPages={totalPages}
			/>}

			<ConfirmationModal />
		</div>
	);
};