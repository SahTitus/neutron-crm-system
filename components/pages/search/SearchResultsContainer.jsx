"use client"
import { Thinking } from '@components/common/loaders/Thinking'
import { SmallCountCard } from '@components/ui/cards/SmallCountCard'
import { SearchResults } from '@components/ui/listing/SearchResults'
import React from 'react'
import { useSelector } from 'react-redux'

export const SearchResultsContainer = () => {
	const { queryData, isLoading, error, } = useSelector((state) => state.query);

	return (
		<>
			{isLoading ? <Thinking bgColor={false} />
				:
				<div className="h-full p-4 flex flex-col  w-full rounded-2xl bg-[#f7f7f7] dark:bg-[#192037] transition-colors duration-500 ">
					<div className='flex items-center gap-3 mb-3'>
						<SmallCountCard
							label={'Results'}
							value={queryData?.length || 0}
							bg_textStyles='bg-yellow-200 text-gray-800 '
						/>
					</div>
					<div className="flex  w-full gap-4 mt-3 h-full">
						<div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-2 ">
							{!!queryData?.length ? <SearchResults queryData={queryData} /> :
								<p className='flex items-center justify-center w-full h-full text-gray-800 dark:text-white text-lg font-semibold'>No results found</p>
							}
						</div>
					</div>
				</div>}
		</>
	)
}
