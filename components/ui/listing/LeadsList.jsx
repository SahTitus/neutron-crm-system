"use client";
import { useEffect, useState } from 'react';
import { Call, Email, MoreVert } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { sourceColors } from '@lib/constants/optionValues';
import { addMoreLeads, deleteLead, fetchLeadsFailure, fetchLeadsStart, onPageChange, } from '@redux/features/leadSlice';
import { Pagination } from '@components/common/Pagination';
import Link from 'next/link';
import { routes } from '@lib/routes';
import Image from 'next/image';
import { useConfirmationModal } from '@hooks/useConfirmationModal';
import { Toast } from '@components/common/Toast';
import { deleteLeadFromDb, fetchLeads } from '@server_actions/lead.action';
import { useStateContext } from '@redux/StateProvider';
import { useSelector } from 'react-redux';
import { fetchFilters } from '@lib/constants/filters';
import { ExportFileButton } from '@components/features/ExportFileButton';
import { handleOpenCampaignModal } from '@utils/helpers';

export const LeadsList = ({ showPagination, leads, currentPage, totalPages, dispatch }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedLeadId, setSelectedLeadId] = useState(null);
	const user = useSelector((state) => state.auth.user);

	const { toggleConfirmationModal, ConfirmationModal } = useConfirmationModal();
	const { setRecepientEmail, setShowToast, setToastMsg, setFormType, toggleSideModal, setFormItemToEdit } = useStateContext();

	const handleMenuOpen = (event, id) => {
		setAnchorEl(event.currentTarget);
		setSelectedLeadId(id);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedLeadId(null); // Clear selected ID when menu closes
	};

	// Assign status background colors
	const updatedLeads = leads?.map(lead => {
		const matchedSource = sourceColors.find(sc => sc.source === lead.source);
		return {
			...lead,
			sourceColor: matchedSource?.sourceColor || 'bg-gray-500',
		};
	});

	const handleDelete = async () => {
		if (!selectedLeadId) return;
		toggleConfirmationModal("Are you sure you want to delete this item?", async () => {
			try {
				await deleteLeadFromDb(selectedLeadId, user?.id);

				dispatch(deleteLead(selectedLeadId));
				setShowToast(true);
				setToastMsg(prevState => ({ ...prevState, message: 'Deleted successfully' }));
			} catch (error) {
				dispatch(fetchLeadsFailure(selectedLeadId));
				setShowToast(true);
				setToastMsg({ isError: true, message: 'Deletion was unsuccessful' });
			}
		}, "bg-red-600 hover:bg-red-700");
		handleMenuClose(); // Close the menu after the delete action
	};

	const handleEdit = async () => {
		if (!selectedLeadId) return;
		toggleConfirmationModal("Are you sure you want to edit this item?", async () => {
			setFormType('lead');

			const seletedItem = leads?.find(item => item?._id === selectedLeadId)
			setFormItemToEdit(seletedItem)
			toggleSideModal('dynamicForm')
		}, "bg-green-500 hover:bg-green-600")
		handleMenuClose(); // Close the menu after the edit action
	};

	useEffect(() => {
		// Fetch leads whenever currentPage changes
		const fetchLeadsData = async () => {
			try {
				dispatch(fetchLeadsStart(currentPage));
			} catch (error) {
				dispatch(fetchLeadsFailure(error.message));
				setShowToast(true);
				setToastMsg({ isError: true, message: 'Failed to fetch leads' });
			}
		};

		fetchLeadsData();
	}, [currentPage, dispatch]);

	const handlePageChange = async (pageChange) => {
		let page = pageChange === "+ve" ? ++currentPage : --currentPage;

		// Ensure newPage is within the valid range
		page = Math.max(1, Math.min(page, totalPages));

		dispatch(onPageChange(page)); // Update the currentPage in the store

		if ((pageChange === '+ve') && (page < totalPages)) {

			const response = await fetchLeads({}, { ...fetchFilters.options, page: page }, user?.companyId);

			dispatch(addMoreLeads(response))
		}
	};

	return (
		<div className="flex flex-col p-4 bg-white dark:bg-gray-900 rounded-lg shadow text-gray-800 dark:text-gray-400">
			<Toast styles='fixed top-10 left-1/2' />

			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-800 dark:text-slate-200">Leads</h2>
				{showPagination ? (
					<ExportFileButton
						data={updatedLeads}
						pathname='Leads'
						aria-label='Export as file'
						querySelectorForImg='table'
					/>) : (
					<Link href={routes.sales} className="bg-orange-300 text-gray-800 p-2 rounded-md hover:bg-orange-200">
						View more
					</Link>
				)}
			</div>

			<div className="relative overflow-x-auto py-4 w-full box-border custom-scrollbar">
				<table className="w-full bg-gray-900 table-fixed">
					<thead>
						<tr>
							<th className="w-20 text-left  bg-white dark:bg-gray-900 px-4 py-2">Image</th>
							<th className="w-52 text-left  bg-white dark:bg-gray-900 px-4 py-2">Name</th>
							<th className="w-72 text-left  bg-white dark:bg-gray-900 px-4 py-2">Email</th>
							<th className="w-32 text-left  bg-white dark:bg-gray-900 px-4 py-2">Status</th>
							<th className="w-40 text-left  bg-white dark:bg-gray-900 px-4 py-2">Phone</th>
							<th className="w-36 text-left  bg-white dark:bg-gray-900 px-4 py-2">Contact</th>
							<th className="w-40 text-left  bg-white dark:bg-gray-900 px-4 py-2">Source</th>
							<th className="w-20 text-left  bg-white dark:bg-gray-900 px-4 py-2">Action</th>
						</tr>
					</thead>
					<tbody>
						{updatedLeads?.map((lead) => (
							<tr key={lead._id}>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-700 border-b">
									<Image src={lead.image} alt={`${lead.firstName} avatar`} width={40} height={40} className="rounded-full w-10 h-10" />
								</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-700 border-b">{`${lead.firstName} ${lead.lastName}`}</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-700 border-b">{lead.email}</td>
								<td className=" py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-700 border-b">
									<span className={`flex justify-center px-4 py-1  rounded text-xs font-semibold ${lead.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
										{lead.status}
									</span>
								</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-700 border-b">
									{lead.phoneNumber}
								</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-700 border-b">
									<a href={`tel:${lead.phoneNumber}`} >
										<span className="sr-only">Telephone Number</span>
										<Call className="cursor-pointer" />
									</a>
									<Email
										onClick={() => handleOpenCampaignModal(setFormType, toggleSideModal, setRecepientEmail(lead?.email))}
										className="cursor-pointer mx-4 text-gray-600 dark:text-gray-200"
									/>
								</td>
								<td className={`px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-700 border-b`}>
									<span className={`${lead?.sourceColor} flex justify-center text-xs font-semibold w-full text-center py-[5px] rounded`}>
										{lead.source}
									</span>
								</td>
								<td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-700 border-b relative">
									<MoreVert className="cursor-pointer" onClick={(event) => handleMenuOpen(event, lead._id)} />
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