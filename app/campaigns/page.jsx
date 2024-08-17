import { CampaigPage } from '@components/pages/Campaign/CampaignPage'
import { filters } from '@lib/constants/filters';
import { sessionFromServer } from '@lib/fetchData';
import { fetchCampaigns } from '@server_actions/campaign.action';
import React from 'react'

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