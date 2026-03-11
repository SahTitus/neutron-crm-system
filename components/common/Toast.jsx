'use client'

import { useStateContext } from '@redux/StateProvider';
import React from 'react';

const Icon = ({ error }) => {

    return (
        <>
            {error ? <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M10 1a9 9 0 100 18 9 9 0 000-18zm4.95 12.122a.75.75 0 01-1.06 1.06L10 11.06l-4.89 4.89a.75.75 0 11-1.06-1.06L8.94 10 4.05 5.11a.75.75 0 011.06-1.06L10 8.94l4.89-4.89a.75.75 0 011.06 1.06L11.06 10l4.89 4.89z"
                    clipRule="evenodd"
                />
            </svg>
                :
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M6.293 9.293a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            }
        </>
    )
};



export const Toast = ({ styles = 'absolute top-10 left-1/2' }) => {
    const { setShowToast, showToast, toastMsg, } = useStateContext();

    return (
        <>
            {showToast ? <div className={`transform -translate-x-1/2  text-white px-5 py-3 rounded shadow-lg z-50 ${styles} ${toastMsg.isError ? 'bg-red-500' : 'bg-green-500'}`}>
                <p className="text-center">{toastMsg.message}</p>
                <button
                    aria-label='Close toast'
                    className="absolute top-1 right-1 text-white  hover:text-gray-200"
                    onClick={() => setShowToast(false)}
                >
                    <Icon error={toastMsg.isError} />
                </button>
            </div> : null}
        </>
    );
};