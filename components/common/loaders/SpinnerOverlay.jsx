'use client'
import React from "react";
import styles from "./Spinner.module.css";
import { Backdrop } from "@mui/material";
import { useStateContext } from "@redux/StateProvider";

export const SpinnerOverlay = () => {
    const { showLoaderOverlay } = useStateContext();

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showLoaderOverlay}>
            <div className={`${showLoaderOverlay ? 'flex' : ''}  z-[1000000]`}>
                <div className="absolute inset-0 bg-black opacity-30" />

                <div className={`flex items-center justify-center fixed top-auto left-auto transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 z-[1000]`}>
                    <div className={styles.spin}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </Backdrop>
    );
};
