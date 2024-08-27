"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTheme } from '@components/features/ThemeProvider';
import 'react-datepicker/dist/react-datepicker.css';
import { FaImage } from "react-icons/fa6";

// Register the components and the annotation plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const Chart = ({ dataSets, labels, excludedKey }) => {
  const [showGridLines, setShowGridLines] = useState(true);
  const [startDate, setStartDate] = useState(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState(new Date('2023-07-31'));
  const chartRef = useRef(null);
  const { theme } = useTheme();

  const transformedDataSets = Object.keys(dataSets)
    .filter(key => key !== excludedKey) // Exclude the specified key
    .map(key => ({
      key: key,
      value: dataSets[key]
    }));

  const createGradient = (ctx, area, color) => {
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color); // Adding opacity for the gradient effect
    return gradient;
  };

  const filterDataByDateRange = (data, startDate, endDate) => {
    const filteredData = data?.filter((_, index) => {
      const date = new Date(2023, index, 1);
      return date >= startDate && date <= endDate;
    });
    return filteredData;
  };

  const data = {
    labels: labels.filter((_, index) => {
      const date = new Date(2023, index, 1);
      return date >= startDate && date <= endDate;
    }),
    datasets: [
      {
        label: transformedDataSets[0].key,
        data: filterDataByDateRange(transformedDataSets[0].value, startDate, endDate),
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          return createGradient(ctx, chartArea, theme === 'light' ? 'rgba(200, 200, 200, 0.2)' : 'rgba(175, 20, 20, 0.1)');
        },
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        tension: 0.3,
      },
      {
        label: transformedDataSets[1].key,
        data: filterDataByDateRange(transformedDataSets[1].value, startDate, endDate),
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          return createGradient(ctx, chartArea, theme === 'light' ? 'rgba(200, 200, 200, 0.2)' : 'rgba(75, 192, 192, 0.2)');
        },
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        tension: 0.3,
      },
      {
        label: transformedDataSets[2].key,
        data: filterDataByDateRange(transformedDataSets[2].value, startDate, endDate),
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          return createGradient(ctx, chartArea, theme === 'light' ? 'rgba(200, 200, 200, 0.2)' : 'rgba(255, 159, 64, 0.4)');
        },
        borderColor: 'rgba(255, 159, 64, 1)',
        pointBackgroundColor: 'rgba(255, 159, 64, 1)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensure the chart fills the container
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: theme === 'light' ? 'black' : 'white',
          usePointStyle: true, // Use circle point style
          pointStyle: 'circle', // Set point style to circle
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Value: ${context.raw}`,
        },
      },
      title: {
        display: true,
        text: 'Monthly Data Chart',
        font: {
          size: 20,
          color: theme === 'light' ? 'black' : 'white',
        },
      },
      subtitle: {
        display: true,
        text: 'Sales, Customers, and Campaigns Data',
        font: {
          size: 16,
          color: theme === 'light' ? 'black' : 'white',
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: showGridLines,
        },
      },
      y: {
        grid: {
          display: showGridLines,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad',
    },
  };

  const downloadImage = () => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.href = chartRef.current.toBase64Image();
      link.download = 'Monthly_Data_Chart.png';
      link.click();
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, theme === 'light' ? 'rgba(200, 200, 200, 0.2)' : 'rgba(50, 50, 50, 0.2)');
      gradient.addColorStop(1, theme === 'light' ? 'rgba(230, 230, 230, 0.5)' : 'rgba(10, 10, 10, 0.5)');
      canvas.style.background = gradient;
    }
  }, [theme]);

  return (
    <div className={`relative bg-slate-100 shadow-sm shadow-slate-400 dark:shadow-2xl dark:shadow-slate-800 dark:bg-gray-900 w-full p-2 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'} rounded-lg shadow-lg h-full`}>
      <button
        onClick={downloadImage}
        className={`absolute flex items-center right-4 top-4 py-2 px-4 rounded-md bg-red-200 text-red-800 text-sm`}
        aria-label='Export as a file'>
        <FaImage className="mr-2" /> Export
      </button>

      <Line ref={chartRef} id="chart" className="h-full" options={options} data={data} />
    </div>
  );
};

export default Chart;
