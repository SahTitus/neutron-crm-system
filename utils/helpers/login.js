import { signIn } from "next-auth/react";

export const login = async (email, password, loginFailure, dispatch) => {

    await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
    }).then((res) => {
        if (!res.ok) {
            dispatch(loginFailure(res?.error))
            return;
        }
    });
}

export const sessionHasExpiry = (expires) => {
    if (expires) {
        const currentTime = new Date().getTime();
        const sessionExpiryTime = new Date(expires).getTime();

        if (currentTime >= sessionExpiryTime) {
            signOut();
            router.push(routes.auth)
        }
    }
};