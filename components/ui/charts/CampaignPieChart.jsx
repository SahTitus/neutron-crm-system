"use client";
import React from 'react';
import Chart from 'react-apexcharts';

const CampaignPieChart = ({ totalSent = 0, totalOpened = 0, totalClicked = 0, totalIgnored = 0 }) => {
	const chartData = {
		series: [totalSent, totalOpened, totalClicked, totalIgnored],
		options: {
			chart: {
				type: 'pie',
			},
			labels: ['Total Sent', 'Total Opened', 'Total Clicked', 'Total Ignored'],
			legend: {
				position: 'bottom',
				labels: {
					colors: "#9CA3AF",
					useSeriesColors: false,
				},
			},
			colors: [
				"#EC4899",  // bg-pink-400
				"#F59E0B",  // bg-yellow-400
				"#10B981",  // bg-green-500
				"#EF4444",  // bg-red-500
			]
			,
			dataLabels: {
				enabled: true,
				formatter: function (val) {
					return val.toFixed(1) + "%";
				},
				style: {
					colors: ['#FFFFFF'],
					fontSize: '14px',
					fontWeight: 'bold',
				},
				dropShadow: {
					enabled: true,
					top: 1,
					left: 1,
					blur: 1,
					opacity: 0.45,
				},
				background: {
					enabled: true,
					foreColor: '#000',
				}
			},
			plotOptions: {
				pie: {
					donut: {
						size: '70%',
					},
					expandOnClick: true,
					offsetX: 0,
					offsetY: 0,
					customScale: 1,
					dataLabels: {
						offset: 0,
					},
				}
			},
			responsive: [{
				breakpoint: 480,
				options: {
					chart: {
						width: 350
					},
					legend: {
						position: 'bottom'
					}
				}
			}]
		},
	};

	return (
		<div className="sticky top-0 flex justify-center items-center h-full min-h-[370px] max-h-[400px] w-full px-2 bg-white dark:bg-[#121826] transition-all duration-300 rounded-lg ">
			<Chart
				options={chartData.options}
				series={chartData.series}
				type="pie"
				width="100%"
				className="my-auto w-full text-red-500"
			/>
		</div>
	);
};

export default CampaignPieChart;