"use client"
import Chart from '@components/ui/charts/Chart'
import React, { useEffect } from 'react'
import { LeadSources } from '../dashboard/LeadSource'
import { OpportunitiesList } from '@components/ui/listing/Opportunities'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOpportunitiesSuccess } from '@redux/features/opportunitySlice'
import { fetchLeadsSuccess } from '@redux/features/leadSlice'
import { LeadsList } from '@components/ui/listing/LeadsList'
import { ScrollToTop } from '@components/common/ScrollToTop'
import { SmallCountCard } from '@components/ui/cards/SmallCountCard'
import useScrollToHash from '@hooks/useScrollToHash'

export const SalesContent = ({ metrics, leadsData, opportunitiesData }) => {
	const dispatch = useDispatch();

	const leads = useSelector((state) => state.lead);
	const { opportunities, currentPage, totalPages, totalOpportunities, error, stagesCount } = useSelector((state) => state.opportunity);


	useEffect(() => {
		dispatch(fetchOpportunitiesSuccess(opportunitiesData))
		dispatch(fetchLeadsSuccess(leadsData))
	}, [])

	// Scroll to #path when the component mounts and the URL contains #path
	useScrollToHash()

	return (
		<section className="h-full p-4 flex flex-col  w-full rounded-2xl bg-[#f7f7f7] dark:bg-[#192037] transition-colors duration-500 ">
			<div className="flex justify-between w-full gap-4 h-80">
				<div className="w-3/5 h-full bg-gray-800 rounded-lg p-2">
					<Chart
						dataSets={metrics.monthlyDataset.dataSets}
						labels={metrics.monthlyDataset.labels}
						excludedKey={"Campaigns"}
					/>
				</div>
				<div className="w-2/5 h-full bg-gray-800 rounded-lg p-2">
					<LeadSources metrics={metrics.leads} />
				</div>
			</div>
			<div className='flex items-center gap-3 mt-6'>
				<SmallCountCard
					label={'Total Opportunities'}
					value={totalOpportunities}
					bg_textStyles='bg-yellow-200 text-gray-800 '
				/>
				<SmallCountCard
					label={'Total Leads'}
					value={leads?.totalLeads}
					bg_textStyles='bg-green-200 text-gray-800'
				/>
				<SmallCountCard
					label={'Opportunities Won'}
					value={stagesCount?.closed_won}
					bg_textStyles='bg-red-200 text-gray-800'
				/>
				<SmallCountCard
					label={'Leads Won'}
					value={leads?.statusesCount?.closed_won}
					bg_textStyles='bg-orange-200 text-gray-800'
				/>
			</div>

			<div className="relative flex flex-col gap-10 mt-6">
				<div id='opportunities' className="w-full h-full bg-gray-800 rounded-lg p-2 ">
					<OpportunitiesList
						currentPage={currentPage}
						opportunities={opportunities}
						totalPages={totalPages}
						showPagination={true}
						dispatch={dispatch}
						error={error}
					/>
				</div>
				<div id='leads' className="w-full h-full bg-gray-800 rounded-lg p-2 ">
					<LeadsList
						currentPage={leads?.currentPage}
						leads={leads?.leads}
						totalPages={leads?.totalPages}
						showPagination={true}
						dispatch={dispatch}
						error={leads?.error}
					/>
				</div>
			</div>

			<ScrollToTop />
		</section>
	)
}
