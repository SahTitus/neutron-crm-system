import { CustomerPage } from '@components/pages/customer/CustomerPage'
import { sessionFromServer } from '@lib/fetchData';
import { fetchCustomers } from '@server_actions/customer.action';
import React from 'react'
import { routes, SITE_URL } from '@lib/routes';
import { seoConfig } from '@lib/seo/seoConfig';
import { customersMetadata } from '@lib/seo/seoMetadata';

export const metadata = seoConfig({
  url: SITE_URL,
  image: routes.neutronIcon,
  title: customersMetadata.title,
  creator: customersMetadata.creator.name,
  keywords: customersMetadata.keywords,
  description: customersMetadata.description,
});


const page = async () => {
  const user = await sessionFromServer();

  const data = await fetchCustomers({}, {}, user?.companyId);

  return (
    <main className='main-page'>
      <CustomerPage data={data} />
    </main>
  )
}

export default page