'use client'
import { CustomersList } from "@components/ui/listing/Customers";
import { LeadSources } from "@components/pages/dashboard/LeadSource";
import { UpcomingTasks } from "@components/pages/dashboard/UpcomingTasks";
import { OverviewCard } from "@components/ui/cards/OverviewCard";
import Chart from "@components/ui/charts/Chart";
import RadarChart from "@components/ui/charts/RadarChart";
import { RecentActivities } from "@components/ui/listing/RecentActivities";
import { RecentLeads } from "@components/ui/listing/RecentLeads";
import { Campaign, Diamond, People, Token } from "@mui/icons-material";
import { useEffect } from "react";
import { fetchCustomersSuccess } from "@redux/features/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import { ScrollToTop } from "@components/common/ScrollToTop";
import { OpportunitiesList } from "@components/ui/listing/Opportunities";
import { fetchOpportunitiesSuccess } from "@redux/features/opportunitySlice";

export const Dashboard = ({ metrics, data }) => {
    const customerData = useSelector((state) => state.customer);
    const opportunitiesData = useSelector((state) => state.opportunity);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCustomersSuccess(data?.customers))
        dispatch(fetchOpportunitiesSuccess(data?.opportunities))
    }, [])

    return (
        <div className="h-full p-4 flex flex-col  w-full rounded-2xl bg-[#f7f7f7] dark:bg-[#192037] transition-colors duration-500 ">
            <div className="grid grid-flow-col auto-cols-fr gap-4 h-fit w-full">
                <OverviewCard
                    key={1}
                    label={'Total Customers'}
                    change={`${metrics.customers?.hasChangeInc ? "+ve" : "-ve"}`}
                    icon={<People />}
                    percentage={metrics.customers?.changePercentage}
                    value={metrics.customers.currentMonthCount}
                    showSinceLastMonth={true}
                />
                <OverviewCard
                    key={2}
                    label={'New Leads'}
                    change={`${metrics.leads?.hasChangeInc ? "+ve" : "-ve"}`}
                    icon={<Diamond />}
                    percentage={metrics.leads?.changePercentage}
                    value={metrics.leads.statusCount.find(item => item.status === 'New')?.count}
                    showSinceLastMonth={true}
                />
                <OverviewCard
                    key={3}
                    label={'Total Opportunities'}
                    change={`${metrics.opportunities?.hasChangeInc ? "+ve" : "-ve"}`}
                    icon={<Token />}
                    percentage={metrics.opportunities?.changePercentage}
                    value={metrics.opportunities.totalCount}
                    showSinceLastMonth={true}
                />
                <OverviewCard
                    key={4}
                    label={'Campaigns Sent'}
                    change={`${metrics.campaigns?.hasChangeInc ? "+ve" : "-ve"}`}
                    percentage={metrics.campaigns?.changePercentage}
                    icon={<Campaign />}
                    value={metrics.campaigns.totalSent}
                    showSinceLastMonth={true}
                />
            </div>
            <div className="flex justify-between w-full gap-4 mt-6 h-80">
                <div className="w-3/5 h-full bg-slate-100 dark:bg-gray-800 rounded-lg p-2">
                    <Chart
                        dataSets={metrics.monthlyDataset.dataSets}
                        labels={metrics.monthlyDataset.labels}
                        excludedKey={"Opportunities"}
                    />
                </div>
                <div className="w-2/5 h-full bg-slate-100 dark:bg-gray-800 rounded-lg p-2">
                    <LeadSources metrics={metrics.leads} />
                </div>
            </div>

            <div className="flex w-full gap-4 mt-6 h-[480px]">
                <div className="w-3/5 h-full bg-slate-100 dark:bg-gray-800 rounded-lg p-2 ">
                    <RadarChart campaignStats={metrics?.campaignPerformance} />
                </div>
                <div className="w-2/5 h-full bg-slate-100 dark:bg-gray-800 rounded-lg p-2">
                    <UpcomingTasks tasks={data.upcomingTasks} />
                </div>
            </div>

            <div className="flex  w-full gap-4 mt-6 h-[400px]">
                <div className="w-3/5 h-full bg-slate-100 dark:bg-gray-800 rounded-lg p-2 ">
                    <RecentLeads leads={data?.leads} />
                </div>
                <div className="w-2/5 h-full bg-slate-100 dark:bg-gray-800 rounded-lg p-2">
                    <RecentActivities activities={data.recentActivities} />
                </div>
            </div>

            <div id="customers" className="relative flex gap-4 mt-6">
                <div className="w-full h-full bg-slate-100 dark:bg-gray-800 rounded-lg p-2 ">
                    <CustomersList
                        currentPage={customerData?.currentPage}
                        customers={customerData?.customers}
                        totalPages={customerData?.totalPages}
                        showPagination={false}
                        dispatch={dispatch}
                        error={customerData.error}
                    />
                </div>
            </div>
            <div id='opportunities' className="relative flex gap-4 mt-6">
                <div className="w-full h-full bg-slate-100 dark:bg-gray-800 rounded-lg p-2 ">
                    <OpportunitiesList
                        currentPage={opportunitiesData?.currentPage}
                        opportunities={opportunitiesData?.opportunities}
                        totalPages={opportunitiesData?.totalPages}
                        showPagination={false}
                        dispatch={dispatch}
                        error={opportunitiesData?.error}
                    />
                </div>
            </div>

            <ScrollToTop />
        </div>
    );
};