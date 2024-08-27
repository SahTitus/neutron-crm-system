"use client";
import { useState } from 'react';
import { Call, Email, Sms, MoreVert } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';

const sampleCustomers = [
    {
        avatar: 'https://i.pravatar.cc/40?img=1',
        firstName: 'Kathryn',
        lastName: 'Murphy',
        email: 'felicia.reid@example.com',
        gender: 'Female',
        status: 'Inactive',
        phone: '567-890-1234',
        country: 'USA',
        createdAt: new Date(),
    },
    {
        avatar: 'https://i.pravatar.cc/40?img=4',
        firstName: 'Darlee',
        lastName: 'Robertson',
        email: 'robertson@example.com',
        gender: 'Male',
        status: 'Active',
        phone: '1234567890',
        country: 'Germany',
        createdAt: new Date(),
    },
    {
        avatar: 'https://i.pravatar.cc/40?img=2',
        firstName: 'Darlee',
        lastName: 'Robertson',
        email: 'robertson@example.com',
        gender: 'Male',
        status: 'Active',
        phone: '1234567890',
        country: 'Germany',
        createdAt: new Date(),
    },
    {
        avatar: 'https://i.pravatar.cc/40?img=8',
        firstName: 'Darlee',
        lastName: 'Robertson',
        email: 'robertson@example.com',
        gender: 'Male',
        status: 'Active',
        phone: '1234567890',
        country: 'Germany',
        createdAt: new Date(),
    },
    {
        avatar: 'https://i.pravatar.cc/40?img=7',
        firstName: 'Darlee',
        lastName: 'Robertson',
        email: 'robertson@example.com',
        gender: 'Male',
        status: 'Active',
        phone: '1234567890',
        country: 'Germany',
        createdAt: new Date(),
    },
    {
        avatar: 'https://i.pravatar.cc/40?img=3',
        firstName: 'Sharon',
        lastName: 'Roy',
        email: 'sharon@example.com',
        gender: 'Female',
        status: 'Inactive',
        phone: '989757485',
        country: 'USA',
        createdAt: new Date(),
    },
    // Add more sample data as needed
];

export const Employees = () => {
    const [filters, setFilters] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const filteredCustomers = sampleCustomers.filter(customer => {
        return (
            (filters.status ? customer.status === filters.status : true) &&
            (filters.city ? customer.city === filters.city : true)
        );
    });


    return (
        <div className="flex flex-col p-4 bg-gray-900 rounded-lg shadow text-gray-400 ">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Employees</h2>
                <button className="p-2 rounded-full hover:bg-gray-700" aria-label='View more employees'             >
                    View more
                </button>
            </div>

            <div className="relative overflow-x-auto py-4 w-full box-border custom-scrollbar">
                <table className="w-full bg-gray-900 table-fixed">
                    <thead className=''>
                        <tr>
                            <th className="w-20 text-left bg-gray-800 px-4 py-2">Image</th>
                            <th className="w-52 text-left bg-gray-800 px-4 py-2">Name</th>
                            <th className="w-56 text-left bg-gray-800 px-4 py-2">Email</th>
                            <th className="w-24 text-left bg-gray-800 px-4 py-2">Gender</th>
                            <th className="w-24 text-left bg-gray-800 px-4 py-2">Status</th>
                            <th className="w-40 text-left bg-gray-800 px-4 py-2">Phone</th>
                            <th className="w-32 text-left bg-gray-800 px-4 py-2">Country</th>
                            <th className="w-36 text-left bg-gray-800 px-4 py-2">Contact</th>
                            <th className="w-20 text-left bg-gray-800 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 border-gray-700 border-b">
                                    <img src={customer.avatar} alt="avatar" className="rounded-full w-10 h-10" />
                                </td>
                                <td className="px-4 py-2 border-gray-700 border-b">{`${customer.firstName} ${customer.lastName}`}</td>
                                <td className="px-4 py-2 border-gray-700 border-b">{customer.email}</td>
                                <td className="px-4 py-2 border-gray-700 border-b">{customer.gender}</td>
                                <td className="px-4 py-2 border-gray-700 border-b">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${customer.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 border-gray-700 border-b">{customer.phone}</td>
                                <td className="px-4 py-2 border-gray-700 border-b">{customer.country}</td>
                                <td className="px-4 py-2 border-gray-700 border-b">
                                    <Call className="cursor-pointer" />
                                    <Email className="cursor-pointer mx-4" />
                                    <Sms className="cursor-pointer" />
                                </td>
                                <td className="px-4 py-2 border-gray-700 border-b relative">
                                    <MoreVert className="cursor-pointer" onClick={handleMenuOpen} />
                                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                                        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                                    </Menu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
