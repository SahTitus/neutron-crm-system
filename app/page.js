import { Dashboard } from '@components/pages/dashboard/Dashboard'
import React from 'react';
import { getDashboardData, getDashboardMetrics, sessionFromServer } from '@lib/fetchData';
import { routes, SITE_URL } from '@lib/routes';
import { homeMetadata } from '@lib/seo/seoMetadata';
import { seoConfig } from '@lib/seo/seoConfig';

export const metadata = seoConfig({
  url: SITE_URL,
  image: routes.neutronIcon,
  title: homeMetadata.title,
  creator: homeMetadata.creator.name,
  keywords: homeMetadata.keywords,
  description: homeMetadata.description,
});

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