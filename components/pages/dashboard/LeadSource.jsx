'use client'
import React, { useEffect, useState } from 'react';

export const LeadSources = ({ metrics, topN = 4 }) => {
  const leadSources = [
    { name: 'Social Media', value: 0, color: 'bg-orange-400', icon: '📱' },
    { name: 'Website', value: 0, color: 'bg-teal-400', icon: '🌐' },
    { name: 'Campaign', value: 0, color: 'bg-blue-500', icon: '📢' },
    { name: 'Call', value: 0, color: 'bg-purple-500', icon: '📞' },
    { name: 'Referral', value: 0, color: 'bg-green-500', icon: '🔗' },
    { name: 'Email Marketing', value: 0, color: 'bg-red-500', icon: '✉️' },
    { name: 'Cold Call', value: 0, color: 'bg-yellow-400', icon: '📞' },
    { name: 'Event', value: 0, color: 'bg-pink-400', icon: '🎉' },
    { name: 'Other', value: 0, color: 'bg-gray-400', icon: '❓' }
  ];

  // Create a lookup map for leadSources
  const leadSourcesMap = leadSources.reduce((acc, source) => {
    acc[source.name] = source;
    return acc;
  }, {});

  // Update leadSources with counts from sourceCount
  metrics.sourceCount.forEach(({ count, source }) => {
    if (leadSourcesMap[source]) {
      leadSourcesMap[source].value = count; // Update the value with the count
    }
  });

  // Convert the map back to an array and sort by value
  const updatedLeadSources = Object.values(leadSourcesMap)
    .sort((a, b) => b.value - a.value)
    .slice(0, topN); // Get top N sources

  const [percentages, setPercentages] = useState([]);

  useEffect(() => {
    const max = Math.max(...updatedLeadSources.map(source => source.value));
    setPercentages(updatedLeadSources.map(source => (max === 0 ? 0 : (source.value / max) * 100)));
  }, []);

  return (
    <div className="w-full mx-auto p-4 h-full bg-gray-900 text-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Top {topN} Lead Sources</h2>
        <div className="bg-gray-700 p-2 rounded-md">This Week</div>
      </div>
      <div className="space-y-4">
        {updatedLeadSources.map((source, index) => (
          <div key={source.name} className="flex items-center space-x-4">
            <div className="text-2xl">{source.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span>{source.name}</span>
                <span>{source.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className={`${source.color} h-2 rounded-full`}
                  style={{ width: `${percentages[index] || 0}%`, transition: 'width 1.5s' }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
