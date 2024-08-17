'use client'
import { Thinking } from '@components/common/loaders/Thinking';
import { SmallCountCard } from '@components/ui/cards/SmallCountCard';
import { CampaignList } from '@components/ui/listing/CampaignList';
import { fetchCampaignsSuccess } from '@redux/features/campaignSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

const CampaignPieChart = dynamic(() => import("@components/ui/charts/CampaignPieChart"),
	{ ssr: false, loading: () => <Thinking bgColor={false} /> },
);

export const CampaigPage = ({ data }) => {
	const dispatch = useDispatch();

	const { campaigns, metrics, currentPage, totalPages, totalCampaigns, error } = useSelector((state) => state.campaign);

	useEffect(() => {
		dispatch(fetchCampaignsSuccess(data))
	}, [])

	return (
		<div className="h-full p-4 flex flex-col  w-full rounded-2xl bg-[#f7f7f7] dark:bg-[#192037] transition-colors duration-500 ">
			<div className='flex items-center gap-3 mb-3'>
				<SmallCountCard
					label={'Total Campaigns'}
					value={totalCampaigns}
					bg_textStyles='bg-yellow-200 text-gray-800 '
				/>
				<SmallCountCard
					label={'Reached'}
					value={metrics?.totalSent}
					bg_textStyles='bg-green-200 text-gray-800'
				/>
				<SmallCountCard
					label={'Opened'}
					value={metrics?.totalOpened}
					bg_textStyles='bg-pink-200 text-gray-800'
				/>
				<SmallCountCard
					label={'Clicked'}
					value={metrics?.totalClicked}
					bg_textStyles='bg-orange-200 text-gray-800'
				/>
				<SmallCountCard
					label={'Ignored'}
					value={(metrics?.totalSent - metrics?.totalOpened) || 0}
					bg_textStyles='bg-red-200 text-gray-800' />
			</div>
			<div className="flex  w-full gap-4 mt-3 h-full">
				<div className="w-3/5 h-full bg-gray-800 rounded-lg p-2 ">
					<CampaignList
						campaigns={campaigns}
						currentPage={currentPage}
						totalPages={totalPages}
						totalCampaigns={totalCampaigns}
						showPagination={true}
						dispatch={dispatch}
					/>
				</div>
				<div className="w-2/5 h-[400px] bg-gray-800 rounded-lg p-2">
					<CampaignPieChart
						totalSent={metrics?.totalSent}
						totalOpened={metrics?.totalOpened}
						totalClicked={metrics?.totalClicked}
						totalIgnored={(metrics?.totalSent - metrics?.totalOpened) || 0}
					/>
				</div>
			</div>
		</div>
	)
}