'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { CampaignRounded, GroupAdd, KeyboardArrowLeft, KeyboardArrowRight, Sell, Settings } from '@mui/icons-material';
import { useStateContext } from '@redux/StateProvider';
import { RiAppsFill, RiLogoutCircleRLine } from 'react-icons/ri';
import { signOut } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { logout } from '@redux/features/authSlice';
import { Tooltip } from '@mui/material';

const sidebarTopItems = [
    {
        label: 'Dashboard',
        icon: <RiAppsFill className='text-2xl' />,
        path: '/',
    },
    {
        label: 'Customers',
        icon: <GroupAdd className='text-2xl' />,
        path: '/customers'
    },
    {
        label: 'Campaigns',
        icon: <CampaignRounded className='text-2xl' />,
        path: '/campaigns'
    },
    {
        label: 'Sales',
        icon: <Sell className='text-2xl' />,
        path: '/sales'
    },
    {
        label: 'Settings',
        icon: <Settings className='text-2xl' />,
        path: '/settings',
    },
];

export const Sidebar = () => {
    const pathname = usePathname();

    const [isActive, setIsActive] = useState(pathname);
    const { toggleSidebar, setCurrentRoute, setShowLoaderOverlay, isCollapsed, hideSide } = useStateContext();

    const dispatch = useDispatch();

    const handleSelectNavItem = (item) => {
        setIsActive(item?.path)
        setCurrentRoute(item)
    }

    const handleLogout = async () => {
        setShowLoaderOverlay(true);
        dispatch(logout())
        await signOut()
    };

    useEffect(() => {
        setIsActive(pathname)
    }, [pathname])

    return (
        <div className={`sticky top-0 ${hideSide ? 'hidden' : 'flex'} flex-col bg-slate-100 dark:bg-[#192037] gap-5 ${isCollapsed ? 'w-[130px]' : 'sm:w-[200px] md:w-[250px]'} h-screen py-4 px-4 transition-all duration-300`}>
            <div className={`flex justify-between items-center w-full ${isCollapsed ? 'justify-center' : ''}`}>
                <Link href='/'>
                    <p className={` flex text-center  text-[#0DD983] custom-3d ${isCollapsed ? 'text-2xl -ml-[2px]' : 'text-3xl '} font-extrabold tracking-wide select-none`}>Neutron</p>
                </Link>

            </div>
            <div className="flex flex-col flex-1 items-start w-full overflow-y-auto custom-scrollbar pr-1">
                {sidebarTopItems.map((item, index) => (
                    <Link href={item.path} onClick={() => handleSelectNavItem(item)} className={`flex items-center gap-6 text-sm ${isActive === item.path ? 'bg-green-500 text-white' : ' dark:hover:bg-white text-[#8F8F8F] dark:text-[#8F8F8F]'} ${isCollapsed ? 'justify-center w-3/4 mx-auto  ' : 'justify-start px-4'} h-8 my-1 rounded-md w-full transition-all duration-300`} key={index}>
                        {item.icon}
                        {!isCollapsed && <p>{item.label}</p>}
                    </Link>
                ))}
            </div>

            <hr className='h-[1px] w-full my-4 mx-auto  border-none bg-gray-400 dark:bg-gray-600' />
            <div className="flex flex-col items-start w-full ">
                {/* log out */}
                <div onClick={handleLogout} className={`flex items-center gap-6 text-sm text-white' hover:bg-slate-200  dark:hover:bg-white text-[#8F8F8F] dark:text-[#8F8F8F] ${isCollapsed ? 'justify-center w-3/4 mx-auto  ' : 'justify-start px-4'} h-8 my-1 rounded-md w-full cursor-pointer transition-all duration-300`} >
                    <RiLogoutCircleRLine className='text-2xl text-red-400' />
                    {!isCollapsed && <p>Log out</p>}
                </div>
            </div>
            <Tooltip title={`${isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} `} arrow>
                <div
                    onClick={toggleSidebar}
                    className={`absolute bottom-8 -right-5 flex items-center justify-center text-gray-700 bg-gray-800 shadow-inner h-11 w-11 shadow-slate-500 rounded-full text-3xl  dark:text-white hover:bg-gray-700 transition-all duration-300 cursor-pointer`}
                >
                    {isCollapsed ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </div>
            </Tooltip>
        </div>
    );
};
