import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { LuDot } from 'react-icons/lu';

const activitiesType = [
  { type: 'Deal', icon: '💼' },
  { type: 'Campaign', icon: '📣' },
  { type: 'Call', icon: '📞' },
  { type: 'Meeting', icon: '📅' },
  { type: 'Website', icon: '🌐' },
  { type: 'Referral', icon: '🤝' },
  { type: 'Social Media', icon: '📱' },
  { type: 'Email Marketing', icon: '📧' },
  { type: 'Cold Call', icon: '📞' },
  { type: 'Event', icon: '🎉' },
  { type: 'Other', icon: '🌟' },
];

export const RecentActivities = ({ activities }) => {
  const updatedActivities = activities?.map(activity => {
    // Find the matching icon from activitiesType
    const match = activitiesType?.find(recent => recent?.type === activity?.type);

    return {
      ...activity,
      icon: match ? match?.icon : '🌟',
    };
  });

  return (
    <div className=" px-3 py-4 bg-gray-900 rounded-lg shadow text-gray-400 text-sm w-full h-full overflow-hidden">
      <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
      <ul className='relative overflow-y-auto px-2 custom-scrollbar h-full pb-8'>
        {updatedActivities?.map(activity => (
          <li key={activity?._id} className="flex items-center p-2 mb-2 bg-gray-800 rounded-lg shadow">
            <span className="text-2xl mr-4">{activity?.icon}</span>
            <div className='flex flex-col w-full gap-1'>
              <p className="text-gray-200 line-clamp-2">{activity?.purpose}</p>
              <div className="flex justify-between text-gray-400 text-xs w-full">
                <p className='flex items-center text-teal-400'>{activity?.performedBy?.userName} <LuDot className='text-blue-500' />
                  <span className='text-teal-500j'>{activity?.type}</span>
                </p>
                <p className="text-gray-500 text-xs">{formatDistanceToNow(new Date(activity?.createdAt))} ago</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};