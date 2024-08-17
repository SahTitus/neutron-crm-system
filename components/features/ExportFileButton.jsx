'use client'
import React, { useState } from 'react'
import { exportToCSV, exportToExcel, exportToImage } from '@utils/exportHelpers';
import { FaFileCsv, FaFileExcel, FaImage } from "react-icons/fa";
import { Menu, MenuItem } from '@mui/material';

export const ExportFileButton = ({ data, pathname, querySelectorForImg }) => {
	const [exportAnchorEl, setExportAnchorEl] = useState(null);

	const handleExportMenuOpen = (event) => {
		setExportAnchorEl(event.currentTarget);
	};

	const handleExportMenuClose = () => {
		setExportAnchorEl(null);
	};

	const handleExport = (format) => {
		const filename = `${pathname}_report_neutron`;
		switch (format) {
			case 'csv':
				exportToCSV(data, filename);
				break;
			case 'excel':
				exportToExcel(data, filename);
				break;
			case 'image':
				exportToImage(document.querySelector(querySelectorForImg), filename);
				break;
			default:
				break;
		}
		handleExportMenuClose();
	};

	return (
		<>
			<div className='flex items-center gap-1 bg-red-200 text-red-800 text-sm px-3 py-2 cursor-pointer rounded-md'
				onClick={handleExportMenuOpen}>
				<FaFileCsv />
				<p>Export Report</p>
			</div>
			<Menu
				anchorEl={exportAnchorEl}
				open={Boolean(exportAnchorEl)}
				onClose={handleExportMenuClose}
			>
				<MenuItem onClick={() => handleExport('csv')}><FaFileCsv className="mr-2" /> CSV</MenuItem>
				<MenuItem onClick={() => handleExport('excel')}><FaFileExcel className="mr-2" /> Excel</MenuItem>
				<MenuItem onClick={() => handleExport('image')}><FaImage className="mr-2" /> Image</MenuItem>
			</Menu>
		</>
	)
}
