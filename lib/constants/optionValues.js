// Enumerated options for opportunity stage
export const opportunityStages = ['Prospecting', 'Negotiation/Review', 'Closed Won', 'Closed Lost', 'Qualification', 'Needs Analysis', 'Value Proposition', 'Decision Makers', 'Perception Analysis', 'Proposal/Price Quote',];

// Enumerated options for lead status
export const leadStatuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];

// Enumerated options for lead source
export const leadSources = ['Website', 'Campaign', 'Referral', 'Social Media', 'Email Marketing', 'Cold Call', 'Event', 'Other'];

// Enumerated options for user roles
export const userRoles = ['admin', 'sales_representative', 'marketing_manager', 'support_representative'];
export const employeeRoles = ['Admin', 'Sales Representative', 'Marketing Manager', 'Support Representative'];

export const roleMapping = {
  admin: 'Admin',
  sales_representative: 'Sales Representative',
  marketing_manager: 'Marketing Manager',
  support_representative: 'Support Representative',
};

// Enumerated options for ticket statuses
export const ticketStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

// Enumerated options for ticket priorities
export const ticketPriorities = ['Low', 'Medium', 'High', 'Urgent'];

// Enumerated options for industries
export const industries = ['Advertising', 'Automotive', 'Consulting', 'E-commerce', 'Financial Services', 'Healthcare', 'Hospitality', 'Insurance', 'Manufacturing', 'Real Estate', 'Retail', 'Software', 'Technology', 'Transportation'];

// Enumerated options for countries
export const countries = ['United States', 'United Kingdom', 'Ghana', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Belgium', 'Austria', 'Finland', 'Ireland', 'Portugal', 'Greece', 'New Zealand', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Egypt', 'Turkey', 'South Korea', 'Russia', 'Poland', 'Indonesia', 'Thailand', 'Malaysia', 'Singapore', 'Vietnam', 'Philippines', 'Saudi Arabia', 'United Arab Emirates', 'Israel', 'Pakistan', 'Iran', 'Iraq', 'Kuwait', 'Qatar', 'Lebanon', 'Jordan', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay', 'Costa Rica', 'Panama', 'Puerto Rico', 'Cuba', 'Jamaica', 'Trinidad and Tobago', 'Dominican Republic', 'Honduras', 'Guatemala', 'El Salvador', 'Nicaragua', 'Belize', 'Haiti', 'Bahamas', 'Barbados', 'Guyana', 'Suriname', 'Fiji', 'Tonga', 'Samoa', 'Solomon Islands', 'Vanuatu', 'Papua New Guinea', 'New Caledonia', 'French Polynesia', 'Mauritius', 'Madagascar', 'Kenya', 'Nigeria', 'Ethiopia', 'Tanzania', 'Uganda', 'Zimbabwe', 'Zambia', 'Botswana', 'Namibia', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Angola', 'Mozambique', 'Cameroon', 'Senegal', 'Mali'];


export const sourceColors = [
  { source: 'Website', sourceColor: 'bg-blue-500 text-gray-800' },
  { source: 'Campaign', sourceColor: 'bg-yellow-400 text-yellow-800' },
  { source: 'Referral', sourceColor: 'bg-green-500 text-gray-800' },
  { source: 'Social Media', sourceColor: 'bg-pink-400 text-gray-800' },
  { source: 'Email Marketing', sourceColor: 'bg-yellow-400 text-gray-800' },
  { source: 'Cold Call', sourceColor: 'bg-orange-400 text-gray-800' },
  { source: 'Event', sourceColor: 'bg-red-200 text-red-800' },
  { source: 'Other', sourceColor: 'bg-teal-400 text-gray-800' }
];

export const stageColors = [
  { stage: 'Prospecting', stageColor: 'bg-blue-500 text-gray-800' },
  { stage: 'Negotiation/Review', stageColor: 'bg-yellow-400 text-yellow-800' },
  { stage: 'Closed Won', stageColor: 'bg-red-400 text-yellow-800' },
  { stage: 'Qualification', stageColor: 'bg-green-500 text-gray-800' },
  { stage: 'Needs Analysis', stageColor: 'bg-pink-400 text-gray-800' },
  { stage: 'Value Proposition', stageColor: 'bg-yellow-400 text-gray-800' },
  { stage: 'Decision Makers', stageColor: 'bg-orange-400 text-gray-800' },
  { stage: 'Closed Lost', stageColor: 'bg-red-200 text-red-800' },
  { stage: 'Proposal/Price Quote', stageColor: 'bg-red-200 text-red-800' },
  { stage: 'Perception Analysis', stageColor: 'bg-teal-400 text-gray-800' }
];

export const statusColors = [
  { status: 'New', statusColor: 'bg-slate-200 text-gray-800' },
  { status: 'Contacted', statusColor: 'bg-yellow-400 text-yellow-800' },
  { status: 'Qualified', statusColor: 'bg-green-200 text-green-800' },
  { status: 'Proposal Sent', statusColor: 'bg-pink-400 text-pink-800' },
  { status: 'Negotiation', statusColor: 'bg-orange-400 text-orange-800' },
  { status: 'Closed Won', statusColor: 'bg-green-500 text-teal-800' },
  { status: 'Closed Lost', statusColor: 'bg-red-200 text-red-800' }
];

