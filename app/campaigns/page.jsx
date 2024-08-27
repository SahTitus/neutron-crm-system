import { CampaigPage } from '@components/pages/Campaign/CampaignPage'
import { filters } from '@lib/constants/filters';
import { sessionFromServer } from '@lib/fetchData';
import { campaignsMetadata } from '@lib/seo/seoMetadata';
import { fetchCampaigns } from '@server_actions/campaign.action';
import React from 'react'
import { routes, SITE_URL } from '@lib/routes';
import { seoConfig } from '@lib/seo/seoConfig';

export const metadata = seoConfig({
  url: SITE_URL,
  image: routes.neutronIcon,
  title: campaignsMetadata.title,
  creator: campaignsMetadata.creator.name,
  keywords: campaignsMetadata.keywords,
  description: campaignsMetadata.description,
});

const page = async () => {
  const user = await sessionFromServer();

  const data = await fetchCampaigns(filters.campaigns, {}, user?.companyId);

  return (
    <main className="main-page">
      < CampaigPage data={data} />
    </main>
  )
}

export default page