"use client";
import { useEffect, useState } from 'react';
import { Call, Email, MoreVert } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import { sourceColors } from '@lib/constants/optionValues';
import { addMoreCustomers, deleteCustomer, fetchCustomersFailure, fetchCustomersStart, onPageChange, } from '@redux/features/customerSlice';
import { Pagination } from '@components/common/Pagination';
import Link from 'next/link';
import { routes } from '@lib/routes';
import Image from 'next/image';
import { useConfirmationModal } from '@hooks/useConfirmationModal';
import { Toast } from '@components/common/Toast';
import { deleteCustomerFromDb, fetchCustomers } from '@server_actions/customer.action';
import { useStateContext } from '@redux/StateProvider';
import { useSelector } from 'react-redux';
import { fetchFilters } from '@lib/constants/filters';
import { ExportFileButton } from '@components/features/ExportFileButton';
import { handleOpenCampaignModal } from '@utils/helpers';


export const CustomersList = ({ showPagination, customers, currentPage, totalPages, dispatch }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const user = useSelector((state) => state.auth.user);

    const { toggleConfirmationModal, ConfirmationModal } = useConfirmationModal();

    const { setRecepientEmail, setShowToast, setToastMsg, toggleSideModal, setFormType, setFormItemToEdit } = useStateContext();

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedCustomerId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCustomerId(null); // Clear selected ID when menu closes
    };

    // Assign status background colors
    const updatedCustomers = customers?.map(customer => {
        const matchedSource = sourceColors.find(sc => sc.source === customer.source);
        return {
            ...customer,
            sourceColor: matchedSource?.sourceColor || 'bg-gray-500',
        };
    });

    const handleDelete = async () => {
        if (!selectedCustomerId) return;
        toggleConfirmationModal("Are you sure you want to delete this item?", async () => {
            try {
                await deleteCustomerFromDb(selectedCustomerId, user?.id);

                dispatch(deleteCustomer(selectedCustomerId));
                setShowToast(true);
                setToastMsg(prevState => ({ ...prevState, message: 'Deleted successfully' }));
            } catch (error) {
                dispatch(fetchCustomersFailure(selectedCustomerId));
                setShowToast(true);
                setToastMsg({ isError: true, message: 'Deletion was unsuccessful' });
            }
        }, "bg-red-600 hover:bg-red-700");
        handleMenuClose(); // Close the menu after the delete action
    };

    const handleEdit = async () => {
        if (!selectedCustomerId) return;
        toggleConfirmationModal("Are you sure you want to edit this item?", async () => {
            setFormType('customer');
            const seletedItem = customers?.find(item => item?._id === selectedCustomerId)
            setFormItemToEdit(seletedItem)
            toggleSideModal('dynamicForm')
        }, "bg-green-500 hover:bg-green-600")
        handleMenuClose(); // Close the menu after the edit action
    };

    useEffect(() => {
        // Fetch customers whenever currentPage changes
        const fetchCustomerData = async () => {
            try {
                dispatch(fetchCustomersStart(currentPage));
            } catch (error) {
                dispatch(fetchCustomersFailure(error.message));
                setShowToast(true);
                setToastMsg({ isError: true, message: 'Failed to fetch customers' });
            }
        };

        fetchCustomerData();
    }, [currentPage, dispatch]);

    const handlePageChange = async (pageChange) => {
        let page = pageChange === "+ve" ? ++currentPage : --currentPage;

        // Ensure newPage is within the valid range
        page = Math.max(1, Math.min(page, totalPages));

        dispatch(onPageChange(page)); // Update the currentPage in the store

        if ((pageChange === '+ve') && (page < totalPages)) {

            const response = await fetchCustomers({}, { ...fetchFilters.options, page: page }, user?.companyId);

            dispatch(addMoreCustomers(response))
        }
    };

    return (
        <div className="flex flex-col p-4  bg-white dark:bg-gray-900 rounded-lg shadow text-gray-800 dark:text-gray-400">
            <Toast styles='fixed top-10 left-1/2' />

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-200">New Customers</h2>
                {showPagination ? (
                    <ExportFileButton
                        data={updatedCustomers}
                        pathname='Customers'
                        querySelectorForImg='table'
                    />) : (
                    <Link href={`${routes.customers}/#customers`} className="bg-orange-300 text-gray-800 p-2 rounded-md hover:bg-orange-200">
                        View more
                    </Link>
                )}
            </div>

            <div className="relative overflow-x-auto py-4 w-full box-border custom-scrollbar">
                <table className="w-full bg-gray-900 table-fixed">
                    <thead>
                        <tr>
                            <th className="w-20 text-left bg-white dark:bg-gray-800 px-4 py-2">Image</th>
                            <th className="w-52 text-left bg-white dark:bg-gray-800 px-4 py-2">Name</th>
                            <th className="w-72 text-left bg-white dark:bg-gray-800 px-4 py-2">Email</th>
                            <th className="w-24 text-left bg-white dark:bg-gray-800 px-4 py-2">Gender</th>
                            <th className="w-24 text-left bg-white dark:bg-gray-800 px-4 py-2">Status</th>
                            <th className="w-40 text-left bg-white dark:bg-gray-800 px-4 py-2">Phone</th>
                            <th className="w-40 text-left bg-white dark:bg-gray-800 px-4 py-2">Country</th>
                            <th className="w-36 text-left bg-white dark:bg-gray-800 px-4 py-2">Contact</th>
                            <th className="w-40 text-left bg-white dark:bg-gray-800 px-4 py-2">Source</th>
                            <th className="w-20 text-left bg-white dark:bg-gray-800 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updatedCustomers?.map((customer) => (
                            <tr key={customer._id}>
                                <td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">
                                    <Image src={customer.image} alt="avatar" width={40} height={40} className="rounded-full w-10 h-10" />
                                </td>
                                <td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">{`${customer.firstName} ${customer.lastName}`}</td>
                                <td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">{customer.email}</td>
                                <td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">{customer.gender}</td>
                                <td className=" py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">
                                    <span className={`flex justify-center px-4 py-1 rounded text-xs font-semibold ${customer.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">
                                    {customer.phoneNumber}
                                </td>
                                <td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">{customer.country}</td>
                                <td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b">
                                    <a aria-label="Telephone" href={`tel:${customer.phoneNumber}`} className="text-gray-200">
                                        <Call className="cursor-pointer" />
                                    </a>
                                    <Email
                                        onClick={() => handleOpenCampaignModal(setFormType, toggleSideModal, setRecepientEmail(customer?.email))}
                                        className="cursor-pointer mx-4"
                                    />
                                </td>
                                <td className={`px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b`}>
                                    <span className={`${customer?.sourceColor} flex justify-center text-xs font-semibold w-full text-center py-[5px] rounded`}>
                                        {customer.source}
                                    </span>
                                </td>
                                <td className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-b relative">
                                    <MoreVert className="cursor-pointer" onClick={(event) => handleMenuOpen(event, customer._id)} />
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