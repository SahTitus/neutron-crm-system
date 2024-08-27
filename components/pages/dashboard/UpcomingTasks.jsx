import { Person } from '@mui/icons-material';
import React from 'react';
import { LuDot } from "react-icons/lu";

export const UpcomingTasks = ({ tasks }) => {

    return (
        <div className="flex flex-col py-4 px-3 rounded-lg shadow-sm shadow-slate-400 bg-white  dark:shadow-2xl dark:shadow-slate-800 dark:bg-gray-900 h-full overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-300">Upcoming Tasks</h2>
            <div className="relative overflow-y-auto px-3 custom-scrollbar h-full">
                {tasks.map((task) => (
                    <div key={task?._id} className="mb- py-2 pl-10 relative">
                        <div className="border-l-2 border-gray-300 dark:border-gray-700 absolute h-full left-6 top-4" />
                        <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-6 w-6 absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 animate-pulse" />
                        <div className="flex items-center mb-1 gap-1">
                            <span className="text-sm font-[500] text-orange-400">{task.date}</span>
                            <span className="text-gray-500 text-sm">{task.time}</span>
                            <span className="flex items-center text-sm font-[500] ml-6 text-pink-500 dark:text-teal-400"><Person /><LuDot className='-ml-1 text-blue-500' />{task.assignTo}</span>
                        </div>
                        <div className="bg-slate-100 dark:bg-gray-800 p-4 rounded-md shadow-md dark:shadow-sm">
                            <p className="font-semibold text-gray-800 dark:text-gray-300">{task.title}</p>
                            <p className='text-sm text-gray-500 dark:text-slate-400 '>{task.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
