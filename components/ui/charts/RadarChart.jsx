"use client";
import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({campaignStats}) => {

  const data = {
    labels: campaignStats?.labels,
    datasets: [{
      label: campaignStats?.datasets?.thisMonth?.label,
      data:campaignStats?.datasets?.thisMonth?.data,
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }, {
      label: campaignStats?.datasets?.lastMonth?.label,
      data: campaignStats?.datasets?.lastMonth?.data,
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }]
  };


  const options = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: false,
          color: '#4B5563', // Customize angle line color
          // lineWidth: 1.5 // Customize angle line width
        },
        grid: {
          color: '#192037', // Customize grid line color
          // lineWidth: 1.5 // Customize grid line width
        },
        suggestedMin: 0,
        // suggestedMax: 100,
        ticks: {
          backdropColor: 'rgba(255, 255, 255, 0)', // Make ticks background transparent
          color: '#8F8F8F', // Tick color
        },
        pointLabels: {
          color: '#8F8F8F', // Point label color
          font: {
            size: 14, // Customize point label font size
          }
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#8F8F8F',
        },
      },
    },
  };
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 rounded-lg shadow-lg px-6 py-8 h-[460px]">
      <h2 className="text-xl font-semibold mb-4 text-center">Compaigns Performance</h2>
      <div className="flex justify-center relative w-full h-full">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default RadarChart;
