import Login from '@components/pages/login/Login'
import React from 'react'

const page = (params) => {
    const { id } = params.searchParams;
   
    return (
        <div className='absolute left-0 top-0 bottom-0 right-0'>
            <Login userId={id} />
        </div>
    )
}

export default page