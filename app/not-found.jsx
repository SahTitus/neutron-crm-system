"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';

// 404 page
const NotFound = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    return (
        <div className="fixed left-0 right-0 top-0 bottom-0  flex flex-col items-center justify-center min-h-full w-screen select-none bg-slate-200 z-30 dark:bg-[#151a2d] overflow-hidden">
            <div className={`text-center transform transition-transform duration-1000 ease-out ${visible ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="text-9xl animate-bounce">😢</div>
                <h1 className="mt-4 text-6xl font-bold text-gray-800 dark:text-gray-300 ">404</h1>
                <p className="mt-2 text-2xl text-gray-600 dark:text-gray-400 ">Oops! Page not found.</p>
                <Link href="/">
                    <p className="mt-6 text-lg font-semibold text-blue-500 hover:underline">
                        Go back home
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;