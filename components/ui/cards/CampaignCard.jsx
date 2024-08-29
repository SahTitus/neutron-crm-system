"use client";
import { MoreVert } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { formatDate } from "@utils/helpers/formatDate";
import { useState } from "react";

export const CampaignCard = ({ campaign, anchorEl, handleMenuOpen, isSearch, handleDelete, handleMenuClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6 p-6 rounded-3xl bg-white dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-500 shadow-sm shadow-gray-300 dark:shadow-lg hover:shadow-md transform hover:-translate-y-1 cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl text-blue-500 dark:text-blue-400 mr-3">📢</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {campaign?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(campaign?.startDate, "DD MMM YYYY", true)} -{" "}
              {formatDate(campaign?.endDate, "DD MMM YYYY", true)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isSearch && <>
            <MoreVert className="cursor-pointer text-white" onClick={(event) => handleMenuOpen(event, campaign?._id)} />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </>}

          <button
            className="text-sm font-semibold text-blue-600 dark:text-gray-800 py-2 px-4 bg-blue-100 dark:bg-blue-200 rounded-full transition-transform transform hover:scale-105"
            aria-label={isExpanded ? "Collapse" : "Expand"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Subject: {campaign?.subject}
          </h4>
          <div
            className={`${isSearch ? 'text-gray-800 dark:text-gray-300' : 'text-gray-800 dark:text-white'} prose dark:prose-invert prose-blue max-w-none mt-4 bg-gray-50 dark:bg-[#252f3f] p-4 rounded-xl`}
            dangerouslySetInnerHTML={{ __html: campaign?.content }}
          />
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="flex items-center justify-center bg-gray-200 dark:bg-[#2d3748] p-2 rounded-lg shadow-inner">
              <strong className="mr-1">Sent:</strong> {campaign?.sent_count}
            </p>
            <p className="flex items-center justify-center bg-gray-200 dark:bg-[#2d3748] p-2 rounded-lg shadow-inner">
              <strong className="mr-1">Opened:</strong> {campaign?.open_count}
            </p>
            <p className="flex items-center justify-center bg-gray-200 dark:bg-[#2d3748] p-2 rounded-lg shadow-inner">
              <strong className="mr-1">Clicked:</strong> {campaign?.click_count}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};