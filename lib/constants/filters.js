import { getDateRanges } from "@utils/helpers/getDateRanges";
import { leadSources, leadStatuses } from "./optionValues";

export const filters = {
	customers: {
		includeGenderCount: true,
		includeStatusCount: true,
		includeCityCount: false,
		includeSourceCount: true,
		includeCountryCount: false,
		genders: ['Male'],
		statuses: [],
		cities: [],
		sources: ['Website', 'Campaign', 'Referral', 'Social Media',],
		countries: [],
		startDate: '',
		endDate: ''
	},
	campaigns: {
		includeSentCount: true,
		includeOpenCount: true,
		includeClickCount: true,
		startDate: '',
		endDate: ''
	},
	leads: {
		includeStatusCount: true,
		statuses: [],
		includeSourceCount: true,
		sources: leadSources,
		includeDateRange: true,
		startDate: '',
		endDate: '',

	},
	employees: {
		country: 'Ghana',
		city: 'Accra',
		gender: 'Male',
		jobTitle: 'Developer',
		role: 'Admin'
	},
	opportunities: {
		includeStageCount: true,
		includeAmountRangeCount: false,
		includeProbabilityRangeCount: false,
		stages: ['Prospecting', 'Qualification'],
		minAmount: 0,
		maxAmount: 50000,
		minProbability: 0,
		maxProbability: 100,
		startDate: '',
		endDate: '',
	},
	task: {},
};

export const fetchFilters = {
	options: {
		page: 1,
		limit: 10,
		sortBy: 'createdAt',
		sortOrder: 'desc',
	},
	lead: {
		filters: {
			firstName: '',
			status: '',
			source: '',
		},


	},
	customer: {
		filters: {
			firstName: '',
			status: '',
			source: '',
		},
	}
}