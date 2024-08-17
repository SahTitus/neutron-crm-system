import Image from 'next/image'
import React from 'react'

export const AuthLandingPage = () => {
    return (
        <div className="relative flex w-1/2 h-full">
            <Image
                src="/assets/images/happy-customer6.jpg"
                alt="Background"
                fill
                className='object-cover'
            />
            <div className="absolute inset-0 bg-black opacity-30" />
            <p className="absolute top-6 text-[#0DD983] custom-3d left-10 text-5xl font-extrabold tracking-wide select-none">Neutron</p>
            <div className="absolute bottom-40 left-10 text-white">
                <div className='max-w-lg'>
                    <p className="text-3xl font-bold">Welcome to Neutron CRM</p>
                    <p className="text-base mt-2 text-gray-300">Log in to access centralized customer data, connect seamlessly, and grow your business relationships.</p>
                </div>

            </div>
            <div className='absolute left-10 bottom-6 max-w-lg'>
                <div className="  relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 rounded-lg" />
                    <blockquote className="relative text- italic text-gray-300 z-10 px-2 py-1">
                        "Businesses should not be focused on sales; they should be focused on building lifelong relationships with their customers." — Tony Hsieh
                    </blockquote>
                </div>
                <p className="text-sm text-gray-400 mt-4">Centralize. Connect. Grow. Energize Customer Relationships.</p>
            </div>
        </div>
    )
}
