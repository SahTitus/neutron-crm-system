"use client"
import React, { useEffect } from 'react'
import { CustomersList } from '../../ui/listing/Customers';
import { fetchCustomersSuccess } from '@redux/features/customerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollToTop } from '@components/common/ScrollToTop';
import { SmallCountCard } from '@components/ui/cards/SmallCountCard';

export const CustomerPage = ({ data }) => {
	const { customers, currentPage, totalPages, totalCustomers, error, statusesCount } = useSelector((state) => state.customer);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchCustomersSuccess(data))
	}, [])

	return (
		<div className="h-full p-4 flex flex-col  w-full rounded-2xl bg-[#f7f7f7] dark:bg-[#192037] transition-colors duration-500 ">
			<div className='flex items-center gap-3'>
				<SmallCountCard
					label={'Total Customers'}
					value={totalCustomers}
					bg_textStyles='bg-yellow-200 text-gray-800 '
				/>
				<SmallCountCard
					label={'Active'}
					value={statusesCount.active}
					bg_textStyles='bg-green-200 text-gray-800'
				/>
				<SmallCountCard
					label={'Inactive'}
					value={statusesCount.inActive}
					bg_textStyles='bg-red-200 text-gray-800'
				/>
			</div>
			<div className="relative flex gap-4 mt-6">
				<div className="w-full h-full bg-gray-800 rounded-lg p-2 ">
					<CustomersList
						showPagination={true}
						currentPage={currentPage}
						customers={customers}
						totalPages={totalPages}
						dispatch={dispatch}
						error={error}
					/>
				</div>
			</div>

			<ScrollToTop />
		</div>
	)
};