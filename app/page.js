import { Dashboard } from '@components/pages/dashboard/Dashboard'
import React from 'react';
import { getDashboardData, getDashboardMetrics, sessionFromServer } from '@lib/fetchData';

const page = async () => {
  const user = await sessionFromServer();

  const metrics = await getDashboardMetrics(user?.companyId);
  const data = await getDashboardData({ companyId: user?.companyId });

  return (
    <main className="main-page">
      <Dashboard metrics={metrics} user={user} data={data} />
    </main>
  )
}

export default page;