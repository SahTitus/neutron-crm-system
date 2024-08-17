import { SalesContent } from '@components/pages/sales/SalesPage'
import { getDashboardMetrics, sessionFromServer } from '@lib/fetchData';
import { fetchLeads } from '@server_actions/lead.action';
import { fetchOpportunities } from '@server_actions/opportunity.action';
import React from 'react'

const page = async () => {
  const user = await sessionFromServer();

  const metrics = await getDashboardMetrics(user?.companyId);

  const opportunitiesData = await fetchOpportunities({}, {}, user?.companyId);
  const leadsData = await fetchLeads({}, {}, user?.companyId);

  return (
    <main className="main-page">
      <SalesContent metrics={metrics} user={user} opportunitiesData={opportunitiesData} leadsData={leadsData} />
    </main>
  )
}

export default page