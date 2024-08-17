'use client'
import React from 'react';
import { HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown } from "react-icons/hi2";
import CountUp from 'react-countup';

export const OverviewCard = ({ label, icon, value, percentage, change, showSinceLastMonth }) => {
  return (
    <div className="flex flex-col justify-between h-28 shadow-2xl shadow-slate-700 bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-200"> {label}</p>
        {icon}
      </div>
      <div className="flex flex-col ">
        <strong className="text-xl my-1">
          <CountUp end={value} duration={2} separator="," />
        </strong>
        <div className="flex items-center gap-2">
          <p className={`flex items-center ${change === '+ve' ? 'text-green-500' : 'text-red-500'} gap-1`}>
            {percentage?.toFixed(2)}%
            {change === '+ve' ? <HiOutlineArrowTrendingUp /> : <HiOutlineArrowTrendingDown />}
          </p>
          {showSinceLastMonth && <p className="text-gray-400 text-sm">since last month</p>}
        </div>
      </div>
    </div>
  )
}
