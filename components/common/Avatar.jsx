import { routes } from '@lib/routes'
import { Avatar } from '@mui/material'
import Link from 'next/link'
import React from 'react'

export const AvatarIcon = ({ image, alt, name, email }) => {
    return (
        <Link className={`flex items-center shadow-sm dark:bg-transparent bg-white dark:shadow-inner w-full max-w-96 dark:shadow-slate-400 shadow-slate-300 rounded-md px-3 py-[5px] transition-all duration-300 ${image ? "" : "animate-pulse"}`} href={routes.settings}>
            <Avatar alt={alt} src={image} className="cursor-pointer" />
            {image && <p className='flex flex-col  px-2 text-sm text-gray-800 dark:text-gray-300 line-clamp-1 '>Hi {name}!
                <span className='text-xs dark:text-gray-400'>{email}</span>
            </p>}
        </Link>
    )
}
