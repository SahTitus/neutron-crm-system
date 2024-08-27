'use client'
import React from 'react';
import { HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown } from "react-icons/hi2";
import CountUp from 'react-countup';

export const OverviewCard = ({ label, icon, value, percentage, change, showSinceLastMonth }) => {
  return (
    <div className="flex flex-col justify-between h-28 shadow-sm shadow-slate-400 dark:shadow-2xl dark:shadow-slate-700 dark:bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between text-gray-800 dark:text-slate-200">
        <p className="text-sm"> {label}</p>
        {icon}
      </div>
      <div className="flex flex-col text-gray-800 dark:text-white">
        <strong className="text-xl my-1 ">
          <CountUp end={value} duration={2} separator="," />
        </strong>
        <div className="flex items-center gap-2">
          <p className={`flex items-center ${change === '+ve' ? 'text-green-500' : 'text-red-500'} gap-1`}>
            {percentage?.toFixed(2)}%
            {change === '+ve' ? <HiOutlineArrowTrendingUp /> : <HiOutlineArrowTrendingDown />}
          </p>
          {showSinceLastMonth && <p className="text-gray-500 dark:text-gray-400 text-sm">since last month</p>}
        </div>
      </div>
    </div>
  )
}
