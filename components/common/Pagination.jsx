import { KeyboardArrowRight } from '@mui/icons-material'
import React from 'react'

export const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
	return (
		<div className="flex justify-end items-center mt-4 gap-4">
			<p className="text-sm text-gray-400">
				Page <span className='text-blue-500'>{currentPage}</span> of {totalPages}
			</p>
			<button
				className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 dark:bg-gray-800 text-white dark:hover:bg-gray-700"
				onClick={() => handlePageChange('+ve')}
				disabled={currentPage === totalPages}
			>
				<KeyboardArrowRight />
			</button>
		</div>
	)
}
