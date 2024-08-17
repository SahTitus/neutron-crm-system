import { CustomerPage } from '@components/pages/customer/CustomerPage'
import { sessionFromServer } from '@lib/fetchData';
import { fetchCustomers } from '@server_actions/customer.action';
import React from 'react'

const page = async () => {
  const user = await sessionFromServer();

  const data = await fetchCustomers({},{} , user?.companyId );

  return (
    <main className='main-page'>

      <CustomerPage data={data} />
    </main>
  )
}

export default page