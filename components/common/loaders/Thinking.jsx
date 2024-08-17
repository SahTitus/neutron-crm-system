import React from "react";
import styles from "./Thinking.module.css";

export const Thinking = ({ bgColor }) => {
  return (
    <div>
      <div className={`flex justify-center items-center ${bgColor ? 'bg-gray-800 rounded-full' : ''} p-4`}>
        <div className={`w-3 h-3 bg-gray-700 rounded-full mx-1 ${styles["animate-spinner"]}`}></div>
        <div className={`w-3 h-3 bg-gray-700 rounded-full mx-1 ${styles["animate-spinner"]} ${styles["animate-delay-200"]}`}></div>
        <div className={`w-3 h-3 bg-gray-700 rounded-full mx-1 ${styles["animate-spinner"]} ${styles["animate-delay-400"]}`}></div>
        <div className={`w-3 h-3 bg-gray-700 rounded-full mx-1 ${styles["animate-spinner"]} ${styles["animate-delay-600"]}`}></div>
      </div>
    </div>
  );
};