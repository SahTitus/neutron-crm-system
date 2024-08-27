'use client'
import React, { useState, } from "react";
import { statusColors } from "@lib/constants/optionValues";
import Link from "next/link";
import { routes } from "@lib/routes";

export const RecentLeads = ({ leads, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Assign status background colors
    const updatedLeads = leads?.leads?.map(lead => {
        const matchedStatus = statusColors.find(sc => sc.status === lead.status);
        return {
            ...lead,
            statusColor: matchedStatus?.statusColor || 'bg-gray-500', // Default color if no match
        };
    });

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        onPageChange(newPage); // Trigger the parent component to fetch data for the new page
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm  dark:shadow h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold dark:text-white text-gray-800">Recent Leads</h2>
                <Link href={`${routes.sales}/#leads`} className="bg-orange-300 text-gray-800 p-2 rounded-md hover:bg-orange-200">
                    View more
                </Link>
            </div>
            <ul className="space-y-3 relative overflow-y-auto px-2 custom-scrollbar h-full pb-12">
                {updatedLeads?.map((lead, index) => (
                    <li key={index} className="flex items-center border-b border-gray-300 dark:border-gray-800 pb-2">
                        <img className="w-10 h-10 rounded-full" src={lead?.image} alt={`${lead?.firstName} ${lead?.lastName}`} />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-slate-100">{lead?.firstName} {lead?.lastName}</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">{lead?.email}</p>
                        </div>
                        <span className={`${lead?.statusColor} ml-auto text-xs font-semibold w-[122px] text-center px-5 py-[5px] rounded`}>
                            {lead?.status}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between items-center mt-4">
                <button
                    aria-label='Previous list'
                    className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-sm text-gray-400">
                    Page {currentPage} of {leads.totalPages}
                </span>
                <button
                    aria-label='Next list'
                    className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === leads.totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
