import { signIn } from "next-auth/react";
import { logger } from "./log";


export const login = async (email, password, loginFailure, dispatch, router) => {
    const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
    });

    if (!res.ok) {
        dispatch(loginFailure(res?.error));
        logger(res?.error);
    } else {
        return router.push('/')
    }
};


export const sessionHasExpiry = (expires) => {
    if (expires) {
        const currentTime = new Date().getTime();
        const sessionExpiryTime = new Date(expires).getTime();

        if (currentTime >= sessionExpiryTime) {
            signOut();
            // router.push(routes.auth)
        }
    }
};