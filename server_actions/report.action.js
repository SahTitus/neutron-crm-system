import { connectDb } from "@db";
import Campaign from "@db/models/campaign.model";
import Customer from "@db/models/customer.model";
import Lead from "@db/models/lead.model";
import Opportunity from "@db/models/opportunity.model";
import { getDateRanges, getYearDateRanges } from "@utils/helpers/getDateRanges";
import { logger } from "@utils/helpers/log";
import mongoose from "mongoose";

const calculateMonthlyChange = async (Model, companyId) => {
	const { currentMonthRange, lastMonthRange } = getDateRanges();

	// Calculate current month count
	const currentMonthCount = await Model.countDocuments({
		companyId: new mongoose.Types.ObjectId(companyId),
		createdAt: { $gte: new Date(currentMonthRange.startDate), $lte: new Date(currentMonthRange.endDate) },
	});

	// Calculate last month count
	const lastMonthCount = await Model.countDocuments({
		companyId: new mongoose.Types.ObjectId(companyId),
		createdAt: { $gte: new Date(lastMonthRange.startDate), $lte: new Date(lastMonthRange.endDate) },
	});

	// Calculate percentage change for month
	const changePercentage = lastMonthCount !== 0
		? Math.abs((currentMonthCount - lastMonthCount) / lastMonthCount) * 100
		: 0;

	// Determine if the change is an increase or a decrease
	const hasChangeInc = currentMonthCount > lastMonthCount;

	return {
		currentMonthCount,
		changePercentage,
		hasChangeInc,
	};
};


export const getCampaignMetrics = async (companyId, filters) => {
	try {
		const {
			includeSentCount = false,
			includeOpenCount = false,
			includeClickCount = false,
			startDate,
			endDate
		} = filters;

		// Base query object
		let query = {};

		// Apply filters
		if (companyId) {
			query.companyId = new mongoose.Types.ObjectId(companyId);
		}

		if (startDate && endDate) {
			query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
		}

		// Initialize aggregation pipeline
		let aggregationPipeline = [{ $match: query }];

		// Add $group stage only if any of the metrics are to be included
		if (includeSentCount || includeOpenCount || includeClickCount) {
			const groupStage = {
				$group: {
					_id: null,
					totalSent: includeSentCount ? { $sum: '$sent_count' } : { $sum: 0 },
					totalOpened: includeOpenCount ? { $sum: '$open_count' } : { $sum: 0 },
					totalClicked: includeClickCount ? { $sum: '$click_count' } : { $sum: 0 }
				}
			};
			aggregationPipeline.push(groupStage);
		}

		// Execute aggregation pipeline
		const [totals] = await Campaign.aggregate(aggregationPipeline);

		// A helper function to calculate monthly changes
		const {
			currentMonthCount,
			changePercentage,
			hasChangeInc,
		} = await calculateMonthlyChange(Campaign, companyId);


		// Initialize metrics object
		let metrics = {
			currentMonthCount,
			changePercentage,
			hasChangeInc,
			totalCount: await Campaign.countDocuments(query),
			totalSent: includeSentCount ? (totals ? totals.totalSent : 0) : 0,
			totalOpened: includeOpenCount ? (totals ? totals.totalOpened : 0) : 0,
			totalOpened: includeOpenCount ? (totals ? totals.totalOpened : 0) : 0,
			totalClicked: includeClickCount ? (totals ? totals.totalClicked : 0) : 0
		};

		return metrics;
	} catch (error) {
		//   console.error('Error fetching dashboard metrics:', error);
		throw new Error('Error fetching dashboard metrics');
	}
};


export const getCustomerMetrics = async (companyId, filters) => {

	try {
		const {
			includeGenderCount = false,
			includeStatusCount = false,
			includeCityCount = false,
			includeSourceCount = false,
			includeCountryCount = false,
			genders = [],
			statuses = [],
			cities = [],
			sources = [],
			countries = [],
			startDate,
			endDate,
		} = filters;

		// Base query object
		let query = { companyId: new mongoose.Types.ObjectId(companyId) };

		if (startDate && endDate) {
			query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
		}

		if (genders.length > 0) query.gender = { $in: genders };
		if (statuses.length > 0) query.status = { $in: statuses };
		if (cities.length > 0) query.city = { $in: cities };
		if (sources.length > 0) query.source = { $in: sources };
		if (countries.length > 0) query.country = { $in: countries };

		// Total count not affected by filters
		const totalCount = await Customer.countDocuments({
			companyId: new mongoose.Types.ObjectId(companyId),
		});

		// A helper function to calculate monthly changes
		const {
			currentMonthCount,
			changePercentage,
			hasChangeInc,
		} = await calculateMonthlyChange(Customer, companyId);


		// Initialize aggregation pipeline
		let aggregationPipeline = [{ $match: query }];

		// Use $facet to gather different counts
		aggregationPipeline.push({
			$facet: {
				genderCount: includeGenderCount
					? [
						{ $group: { _id: '$gender', count: { $sum: 1 } } },
						{ $project: { _id: 0, gender: '$_id', count: 1 } },
					]
					: [],
				statusCount: includeStatusCount
					? [
						{ $group: { _id: '$status', count: { $sum: 1 } } },
						{ $project: { _id: 0, status: '$_id', count: 1 } },
					]
					: [],
				cityCount: includeCityCount
					? [
						{ $group: { _id: '$city', count: { $sum: 1 } } },
						{ $project: { _id: 0, city: '$_id', count: 1 } },
					]
					: [],
				sourceCount: includeSourceCount
					? [
						{ $group: { _id: '$source', count: { $sum: 1 } } },
						{ $project: { _id: 0, source: '$_id', count: 1 } },
					]
					: [],
				countryCount: includeCountryCount
					? [
						{ $group: { _id: '$country', count: { $sum: 1 } } },
						{ $project: { _id: 0, country: '$_id', count: 1 } },
					]
					: [],
			},
		});

		// Execute aggregation pipeline
		const [totals] = await Customer.aggregate(aggregationPipeline);

		// Initialize metrics object
		let metrics = {
			totalCount,
			currentMonthCount,
			hasChangeInc,
			changePercentage,
			genderCount: includeGenderCount ? totals.genderCount || [] : [],
			statusCount: includeStatusCount ? totals.statusCount || [] : [],
			cityCount: includeCityCount ? totals.cityCount || [] : [],
			sourceCount: includeSourceCount ? totals.sourceCount || [] : [],
			countryCount: includeCountryCount ? totals.countryCount || [] : [],
		};

		return metrics;
	} catch (error) {
		console.error('Error fetching customer metrics:', error);
		throw new Error('Error fetching customer metrics');
	}
};

export const getEmployeeMetrics = async (companyId, filters) => {
	try {
		const query = { companyId };

		// Build the query based on the filters provided
		if (filters.country) {
			query.country = filters.country;
		}
		if (filters.city) {
			query.city = filters.city;
		}
		if (filters.gender) {
			query.gender = filters.gender;
		}
		if (filters.jobTitle) {
			query.jobTitle = filters.jobTitle;
		}
		if (filters.role) {
			query.role = filters.role;
		}

		const aggregationPipeline = [];

		// Add filters to aggregation pipeline
		if (filters.country) {
			aggregationPipeline.push({ $match: { country: filters.country } });
		}
		if (filters.city) {
			aggregationPipeline.push({ $match: { city: filters.city } });
		}
		if (filters.gender) {
			aggregationPipeline.push({ $match: { gender: filters.gender } });
		}
		if (filters.jobTitle) {
			aggregationPipeline.push({ $match: { jobTitle: filters.jobTitle } });
		}
		if (filters.role) {
			aggregationPipeline.push({ $match: { role: filters.role } });
		}

		// Count total users
		aggregationPipeline.push({
			$group: {
				_id: null,
				totalUsers: { $sum: 1 },
				genderCount: { $sum: { $cond: [{ $eq: ["$gender", "Male"] }, 1, 0] } },
				cityCount: { $sum: { $cond: [{ $eq: ["$city", "CityName"] }, 1, 0] } },
				countryCount: { $sum: { $cond: [{ $eq: ["$country", "CountryName"] }, 1, 0] } },
				jobTitleCount: { $sum: { $cond: [{ $eq: ["$jobTitle", "JobTitle"] }, 1, 0] } },
				roleCount: { $sum: { $cond: [{ $eq: ["$role", "Role"] }, 1, 0] } }
			}
		});

		const result = await User.aggregate(aggregationPipeline);

		return result[0] || {};
	} catch (error) {
		//   console.error('Error fetching user metrics:', error);
		throw new Error('Error fetching user metrics');
	}
};




export const getLeadMetrics = async (companyId, filters) => {
	try {
		const {
			includeStatusCount = false,
			includeSourceCount = false,
			includeDateRange = false,
			statuses = [],
			sources = [],
			startDate,
			endDate,
		} = filters;

		// Base query object with companyId
		let query = { companyId: new mongoose.Types.ObjectId(companyId) };

		if (includeDateRange && startDate && endDate) {
			query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
		}

		if (statuses.length > 0) {
			query.status = { $in: statuses };
		}

		if (sources.length > 0) {
			query.source = { $in: sources };
		}

		// Total count not affected by status or source filters
		const totalCount = await Lead.countDocuments({
			companyId: new mongoose.Types.ObjectId(companyId),
		});

		// A helper function to calculate monthly changes
		const {
			currentMonthCount,
			changePercentage,
			hasChangeInc,
		} = await calculateMonthlyChange(Lead, companyId);

		// Initialize aggregation pipeline
		let aggregationPipeline = [{ $match: query }];

		// Group by status and source and count each
		if (includeStatusCount || includeSourceCount) {
			aggregationPipeline.push({
				$facet: {
					statusCount: includeStatusCount
						? [
							{
								$group: {
									_id: '$status',
									count: { $sum: 1 },
								},
							},
							{
								$project: {
									_id: 0,
									status: '$_id',
									count: 1,
								},
							},
						]
						: [],
					sourceCount: includeSourceCount
						? [
							{
								$group: {
									_id: '$source',
									count: { $sum: 1 },
								},
							},
							{
								$project: {
									_id: 0,
									source: '$_id',
									count: 1,
								},
							},
						]
						: [],
				},
			});
		}



		// Execute aggregation pipeline
		const [totals] = await Lead.aggregate(aggregationPipeline);

		// Initialize metrics object
		let metrics = {
			totalCount,
			currentMonthCount,
			changePercentage,
			hasChangeInc,
			statusCount: includeStatusCount ? totals.statusCount || [] : [],
			sourceCount: includeSourceCount ? totals.sourceCount || [] : [],
		};

		return metrics;
	} catch (error) {
		//   console.error('Error fetching lead metrics:', error);
		throw new Error('Error fetching lead metrics');
	}
};
export const getOpportunityMetrics = async (companyId, filters) => {
	try {
		const {
			includeStageCount = false,
			includeAmountRangeCount = false,
			includeProbabilityRangeCount = false,
			stages = [],
			minAmount,
			maxAmount,
			minProbability,
			maxProbability,
			startDate,
			endDate,
		} = filters;

		// Base query object
		let query = { companyId: new mongoose.Types.ObjectId(companyId) };

		if (startDate && endDate) {
			query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
		}

		if (stages.length > 0) {
			query.stage = { $in: stages };
		}

		if (minAmount !== undefined && maxAmount !== undefined) {
			query.amount = { $gte: minAmount, $lte: maxAmount };
		}

		if (minProbability !== undefined && maxProbability !== undefined) {
			query.probability = { $gte: minProbability, $lte: maxProbability };
		}

		// Total count not affected by filters
		const totalCount = await Opportunity.countDocuments({
			companyId: new mongoose.Types.ObjectId(companyId),
		});

		// A helper function to calculate monthly changes
		const {
			currentMonthCount,
			changePercentage,
			hasChangeInc,
		} = await calculateMonthlyChange(Opportunity, companyId);

		// Initialize aggregation pipeline
		let aggregationPipeline = [{ $match: query }];

		// Use $facet to gather different counts
		aggregationPipeline.push({
			$facet: {
				stageCount: includeStageCount
					? [
						{
							$group: {
								_id: '$stage',
								count: { $sum: 1 },
							},
						},
						{
							$project: {
								_id: 0,
								stage: '$_id',
								count: 1,
							},
						},
					]
					: [],
				amountRangeCount: includeAmountRangeCount
					? [
						{
							$bucket: {
								groupBy: '$amount', // Field to bucket
								boundaries: [0, 1000, 5000, 10000, 50000, 100000, 500000], // Example boundaries
								default: 'Other', // Bucket for values outside boundaries
								output: { count: { $sum: 1 } },
							},
						},
						{
							$project: {
								_id: 0,
								range: '$_id',
								count: 1,
							},
						},
					]
					: [],
				probabilityRangeCount: includeProbabilityRangeCount
					? [
						{
							$bucket: {
								groupBy: '$probability', // Field to bucket
								boundaries: [0, 20, 40, 60, 80, 100], // Example boundaries
								default: 'Other', // Bucket for values outside boundaries
								output: { count: { $sum: 1 } },
							},
						},
						{
							$project: {
								_id: 0,
								range: '$_id',
								count: 1,
							},
						},
					]
					: [],
			},
		});

		// Execute aggregation pipeline
		const [totals] = await Opportunity.aggregate(aggregationPipeline);

		// Initialize metrics object
		let metrics = {
			totalCount,
			currentMonthCount,
			hasChangeInc,
			changePercentage,
			stageCount: includeStageCount ? totals.stageCount || [] : [],
			amountRangeCount: includeAmountRangeCount ? totals.amountRangeCount || [] : [],
			probabilityRangeCount: includeProbabilityRangeCount ? totals.probabilityRangeCount || [] : [],
		};

		return metrics;
	} catch (error) {
		//   console.error('Error fetching opportunity metrics:', error);
		throw new Error('Error fetching opportunity metrics');
	}
};

export const getMonthlyDataCounts = async (companyId) => {
	const dateRanges = getYearDateRanges();

	const dataSets = {
		Leads: [],
		Opportunities: [],
		Customers: [],
		Campaigns: [],
	};

	for (const range of dateRanges) {
		const { startDate, endDate } = range;

		const leadCount = await Lead.countDocuments({
			companyId: new mongoose.Types.ObjectId(companyId),
			createdAt: { $gte: startDate, $lte: endDate },
		});

		const opportunityCount = await Opportunity.countDocuments({
			companyId: new mongoose.Types.ObjectId(companyId),
			createdAt: { $gte: startDate, $lte: endDate },
		});

		const customerCount = await Customer.countDocuments({
			companyId: new mongoose.Types.ObjectId(companyId),
			createdAt: { $gte: startDate, $lte: endDate },
		});

		const campaignCount = await Campaign.countDocuments({
			companyId: new mongoose.Types.ObjectId(companyId),
			createdAt: { $gte: startDate, $lte: endDate },
		});

		dataSets.Leads.push(leadCount);
		dataSets.Opportunities.push(opportunityCount);
		dataSets.Customers.push(customerCount);
		dataSets.Campaigns.push(campaignCount);
	}

	const labels = dateRanges.map((range, index) => {
		return range.startDate.toLocaleString('default', { month: 'long' });
	});

	return { dataSets, labels };
};


export const getMonthlyCampaignStats = async (companyId) => {

	const { currentMonthRange, lastMonthRange } = getDateRanges();

	try {
		// Connect to the db
		await connectDb();


		// Function to get counts for a given date range
		const getCountsForRange = async (startDate, endDate) => {
			const campaigns = await Campaign.find({
				companyId: new mongoose.Types.ObjectId(companyId),
				createdAt: { $gte: startDate, $lte: endDate },
			});

			const sentTotal = campaigns.reduce((acc, campaign) => acc + campaign.sent_count, 0);
			const openTotal = campaigns.reduce((acc, campaign) => acc + campaign.open_count, 0);
			const clickTotal = campaigns.reduce((acc, campaign) => acc + campaign.click_count, 0);

			return { sentTotal, openTotal, clickTotal };
		};

		// Get counts for this month
		const thisMonthCounts = await getCountsForRange(currentMonthRange.startDate, currentMonthRange.endDate);

		// Get counts for last month
		const lastMonthCounts = await getCountsForRange(lastMonthRange.startDate, lastMonthRange.endDate);

		const thisMonthIgnoredCount = thisMonthCounts.sentTotal - thisMonthCounts.openTotal;
		const lastMonthIgnoredCount = lastMonthCounts.sentTotal - lastMonthCounts.openTotal;

		// Structure the datasets
		const datasets = {
			thisMonth: {
				label: 'This Month',
				data: [thisMonthCounts.sentTotal, thisMonthCounts.openTotal, thisMonthCounts.clickTotal,'300' ],
			},
			lastMonth: {
				label: 'Last Month',
				data: [lastMonthCounts.sentTotal, lastMonthCounts.openTotal, lastMonthCounts.clickTotal, lastMonthIgnoredCount, '260'],
			},
		};

		const labels = ['Reached', 'Opened', 'Clicked', 'Ignored', "Rejected"];

		return { datasets, labels };
	} catch (error) {
		logger(error);
		return { status: 500, message: error.message };
	}
};