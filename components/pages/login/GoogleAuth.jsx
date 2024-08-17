import React from 'react'
import { BsGoogle } from 'react-icons/bs'
import { signIn } from "next-auth/react";
import { Button } from '@components/common/Button';

export const GoogleAuth = ({ setShowLoaderOverlay }) => {
    const loginWithGoogle = () => {
        signIn("google", { redirect: false });
        setShowLoaderOverlay(true);
    };

    return (
        <Button
            onClick={loginWithGoogle}
            className='flex items-center justify-center gap-4 bg-slate-200 hover:bg-slate-100 text-gray-900 shadow shadow-zinc-700 p-3 w-11/12 mt-6 mx-auto rounded-full' type='button'
            ariaLabel='Continue with Google'
            disabled={false}
            label={<div className='flex items-center gap-6'>
                <BsGoogle className='text-red-500' />
                <p>Continue with Google</p>
            </div>}
        />
    )
};