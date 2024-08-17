'use client';
import { routes } from '@lib/routes';
import { userData } from '@redux/features/authSlice';
import { useAppDispatch } from '@redux/store';
import { sessionHasExpiry } from '@utils/helpers/login';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export const UserSession = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();

  sessionHasExpiry(session?.expires)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      dispatch(userData(session.user));

    } else {
      //if not authenticated push user to login page
      if (status !== 'loading') {
        router.push(routes.auth)
      };
    }
  }, [session, status, dispatch]);

  return <div></div>;
};