"use client";
import Image from "next/image";
import { formatDate } from "@utils/helpers/formatDate";
import { useState } from "react";
import { getEmojiForFilter } from "@utils/helpers/getEmojiForFilter";

export const SearchResultsCard = ({ type, item}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Card Header with Title
  const CardHeader = () => (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {item?.image && (
          <Image
            src={item?.image}
            alt={`${item?.image} image`}
            width={50}
            height={50}
            className="rounded-full w-12 h-12 mr-4"
          />
        )}
        <div className="text-2xl text-blue-500 dark:text-blue-400 mr-3">
          {getEmojiForFilter(type)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {item?.name || item?.title || `${item?.firstName} ${item?.lastName}`}
          </h3>
          {item?.startDate && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(item?.startDate, "DD MMM YYYY", true)} -{" "}
              {formatDate(item?.endDate, "DD MMM YYYY", true)}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="text-sm font-semibold text-blue-600 dark:text-gray-800 py-2 px-4 bg-blue-100 dark:bg-blue-200 rounded-full transition-transform transform hover:scale-105"
          aria-label={isExpanded ? "Collapse" : "Expand"}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>
    </div>
  );

  // Conditionally render specific details based on type
  const renderDetails = () => {
    switch (type) {
      case "customer":
        return (
          <>
            <DetailItem label="Type" value={item?.type} />
            <DetailItem label="Email" value={item?.email} />
            <DetailItem label="Gender" value={item?.gender} />
            <DetailItem label="Status" value={item?.status} />
            <DetailItem label="City" value={item?.city} />
            <DetailItem label="Country" value={item?.country} />
            <DetailItem label="Source" value={item?.source} />
            <DetailItem label="Phone Number" value={item?.phoneNumber} />
          </>
        );
      case "lead":
        return (
          <>
            <DetailItem label="Type" value={item?.type} />
            <DetailItem label="Email" value={item?.email} />
            <DetailItem label="Status" value={item?.status} />
            <DetailItem label="Source" value={item?.source} />
            <DetailItem label="Phone Number" value={item?.phoneNumber} />
            <DetailItem label="Notes" value={item?.notes} />
          </>
        );
      case "opportunity":
        return (
          <>
            <DetailItem label="Type" value={item?.type} />
            <DetailItem label="Email" value={item?.email} />
            <DetailItem label="Amount" value={item?.amount} />
            <DetailItem label="Probability" value={`${item?.probability}%`} />
            <DetailItem label="Stage" value={item?.stage} />
            <DetailItem label="Close Date" value={formatDate(item?.closeDate, "DD MMM YYYY", true)} />
            <DetailItem label="Phone Number" value={item?.phoneNumber} />
            <DetailItem label="Notes" value={item?.notes} />
          </>
        );
      case "task":
        return (
          <>
            <DetailItem label="Type" value={item?.type} />
            <DetailItem label="Task" value={item?.title} />
            <DetailItem label="Due Date" value={formatDate(`${item?.date} ${item?.time}`, "DD MMM YYYY", true)} />
            <DetailItem label="Assigned To" value={item?.assignTo} />
            <DetailItem label="Description" value={item?.description} />
          </>
        );
      default:
        return null;
    }
  };

  // Detail item component
  const DetailItem = ({ label, value }) => (
    <div className="flex justify- py-2 border-b border-gray-200 dark:border-gray-700">
      <span className="font-medium text-gray-600 dark:text-gray-400 w-1/5">{label}:</span>
      <span className="text-gray-900 dark:text-white capitalize">{value}</span>
    </div>
  );

  return (
    <div className="mb-6 p-6 rounded-3xl bg-white dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-500 shadow-lg hover:shadow-md transform hover:-translate-y-1 cursor-pointer">
      <CardHeader />
      {isExpanded && (
        <div className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-400">
          {renderDetails()}
        </div>
      )}
    </div>
  );
};
