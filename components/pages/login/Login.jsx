'use client'
import React from 'react';
import { AuthLandingPage } from './AuthLandingPage';
import { AuthForm } from '@components/ui/forms/AuthForm';

const Login = ({userId}) => {

    return (
        <div className="flex h-screen select-none">
            {/* Left Side */}
            <AuthLandingPage />
            <div className="absolute bottom-1/2 top-1/bottom-1/2 my-auto mx-auto right-0 left-0 w-12 h-12 bg-green-500 transform rotate-45 -translate-y-8  z-10" />

            {/* Right Side: Form */}
            <AuthForm userId={userId} />
        </div>
    );
};

export default Login;