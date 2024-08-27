import { Toast } from '@components/common/Toast'
import React from 'react'
import { SearchResultsCard } from '../cards/SearchResultsCard'
import { CampaignCard } from '../cards/CampaignCard'

export const SearchResults = ({ queryData }) => {
	return (
		<div className="p-6 space-y-6 w-full rounded-2xl bg-gray-50 dark:bg-[#121826] transition-colors duration-500">
			<Toast styles='fixed top-10 left-1/2' />
			{queryData?.map((item) => (
				<>
					{item?.type === "campaign" ?
						<CampaignCard
							key={item?._id}
							campaign={item}
							isSearch={true}
							type={item?.type}
							anchorEl={undefined}
							handleDelete={undefined}
							handleMenuOpen={undefined}
							handleMenuClose={undefined}
						/> :
						<SearchResultsCard
							key={item?._id}
							item={item}
							type={item?.type}
						/>}
				</>
			))}
		</div>
	)
}
