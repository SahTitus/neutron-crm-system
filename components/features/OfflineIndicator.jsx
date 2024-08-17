'use client'
import { WifiOffRounded, WifiRounded } from '@mui/icons-material';
import { useState, useEffect } from 'react';

export const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowIndicator(true);
            setTimeout(() => setShowIndicator(false), 5000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowIndicator(true);
            setTimeout(() => setShowIndicator(false), 5000);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showIndicator) return null;

    return (
        <div
            className={`fixed bottom-5 right-5 w-full max-w-48 px-4 py-2 rounded text-white 
            ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
        >
            {isOnline ? <p>  <WifiRounded />  You are online</p> : <p><WifiOffRounded /> You are offline</p>}
        </div>
    );
};