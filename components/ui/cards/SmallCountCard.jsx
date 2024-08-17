import React from 'react'

export const SmallCountCard = ({ label, value, bg_textStyles }) => {
	return (
		<p className={`rounded py-3 px-4 bg-green-200 ${bg_textStyles}`}>{label}:
			<span className='font-semibold px-2 py-1 rounded-sm text-base ml-1'>{value}</span>
		</p>
	)
}
