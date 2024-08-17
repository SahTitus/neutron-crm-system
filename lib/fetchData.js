import { getCampaignMetrics, getCustomerMetrics, getLeadMetrics, getMonthlyCampaignStats, getMonthlyDataCounts, getOpportunityMetrics } from "@server_actions/report.action";
import { fetchFilters, filters } from "./constants/filters";
import { fetchTasks } from "@server_actions/task.action";
import { fetchRecentActivities } from "@server_actions/recentActivity.action";
import { fetchLeads } from "@server_actions/lead.action";
import { getServerSession } from 'next-auth';
import { OPTIONS } from '@app/api/auth/[...nextauth]/options';
import { fetchCustomers } from "@server_actions/customer.action";
import { Backdrop } from "@components/common/Backdrop";
import { fetchOpportunities } from "@server_actions/opportunity.action";

export const sessionFromServer = async () => {
	const session = await getServerSession(OPTIONS);

	const user = session?.user;

	if (!session) {
		// If session is not found, return a placeholder or redirect (handled by middleware)
		return (
			<div>
				<p className='z-40'>Redirecting...</p>
				<Backdrop />
			</div>);
	}
	return user;
}

export const getDashboardMetrics = async (companyId) => {
	const leadMetricsPromise = getLeadMetrics(companyId, filters.leads);
	const campaignMetricsPromise = getCampaignMetrics(companyId, filters.campaigns);
	const opportunityMetricsPromise = getOpportunityMetrics(companyId, filters.opportunities);
	const customerMetricsPromise = getCustomerMetrics(companyId, filters.customers);
	const monthlyDataCountsPromise = getMonthlyDataCounts(companyId);
	const campaignStatsPromise = getMonthlyCampaignStats(companyId);

	const [
		leadsMetrics,
		campaignMetrics,
		opportunitiesMetrics,
		customersMetrics,
		monthlyDataCountsMetrics,
		campaignPerformance
	] = await Promise.all([
		leadMetricsPromise,
		campaignMetricsPromise,
		opportunityMetricsPromise,
		customerMetricsPromise,
		monthlyDataCountsPromise,
		campaignStatsPromise
	]);

	const metrics = {
		campaigns: campaignMetrics,
		customers: customersMetrics,
		leads: leadsMetrics,
		opportunities: opportunitiesMetrics,
		monthlyDataset: monthlyDataCountsMetrics,
		campaignPerformance: campaignPerformance
	}
	return metrics;
};

export const getDashboardData = async ({ companyId, userId, role }) => {
	const upcomingTasksPromise = fetchTasks(companyId);
	const recentActivitiesPromise = fetchRecentActivities(role, userId, companyId);
	const leadsPromise = fetchLeads(fetchFilters.lead.filters, fetchFilters.options, companyId);
	const customersPromise = fetchCustomers(fetchFilters.customer.filters, fetchFilters.options, companyId);
	const opportunitiesPromise = fetchOpportunities({}, fetchFilters.options, companyId);

	const [
		upcomingTasks,
		recentActivities,
		leads,
		customers,
		opportunities
	] = await Promise.all([
		upcomingTasksPromise,
		recentActivitiesPromise,
		leadsPromise,
		customersPromise,
		opportunitiesPromise
	]);

	const data = {
		upcomingTasks,
		recentActivities,
		leads,
		customers,
		opportunities,
	}
	return data;
}

export const getSalesMetrics = async (companyId) => {
	const leadMetricsPromise = getLeadMetrics(companyId, filters.leads);
	const opportunityMetricsPromise = getOpportunityMetrics(companyId, filters.opportunities);
	const monthlyDataCountsPromise = getMonthlyDataCounts(companyId);


	const [leadsMetrics,
		opportunitiesMetrics,
		monthlyDataCountsMetrics,
	] = await Promise.all([
		leadMetricsPromise,
		opportunityMetricsPromise,
		monthlyDataCountsPromise,
	]);

	const metrics = {
		leads: leadsMetrics,
		opportunities: opportunitiesMetrics,
		monthlyDataset: monthlyDataCountsMetrics,
	}
	return metrics;
};