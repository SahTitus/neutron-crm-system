"use client";

import React from 'react';
import { Menu, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { getEmojiForFilter } from '@utils/helpers/getEmojiForFilter';
import { filterCheckboxStyles } from '@styles/styles';

export const FilterMenu = ({ anchorEl, onClose, filters, setFilters }) => {
	// Function to handle filter option toggle
	const handleFilterOption = (option) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[option]: !prevFilters[option],
		}));
	};

	return (
		<Menu
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={onClose}
			keepMounted
		>
			{Object.keys(filters).map((option) => (
				<MenuItem
					key={option}
					onClick={() => handleFilterOption(option)}
					className='dark:bg-gray-800 dark:hover:bg-gray-700 h-full'
				>
					<Checkbox
						checked={filters[option]}
						sx={filterCheckboxStyles}
					/>
					<ListItemText
						className='dark:text-white'
						primary={`${getEmojiForFilter(option)} ${option?.charAt(0)?.toUpperCase() + option?.slice(1)}`}
					/>
				</MenuItem>
			))}
		</Menu>
	);
};
