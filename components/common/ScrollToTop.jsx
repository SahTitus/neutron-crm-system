'use client'
import useScroll from "@hooks/useScroll";
import { KeyboardArrowUp } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useStateContext } from "@redux/StateProvider";
import Link from "next/link";
import React from "react";

export const ScrollToTop = () => {
  const { settings } = useStateContext();

  const isScrollingUp = useScroll();

  return (
    <Link className={` ${settings?.hideScrollToTop?'hidden':''} fixed flex items-center justify-center w-[50px] h-[50px] bottom-6 bg-orange-500 right-12 ${!isScrollingUp 
      ? "translate-x-full rounded-full hidden"
      : " rounded-3xl "
      } transition-transform duration-400 ease-in-out`} aria-labelledby="Scroll to top" href="#">
      <span className="sr-only">Scroll to top</span>
      <Tooltip title='Scroll to top' arrow>
        <div
        >
          <button
            type="button"
            aria-label="Scroll to top"
            className={`bg-blue flex items-center justify-center gap-2`}
          >
            <KeyboardArrowUp className={` text-white h-6 w-6`} />
          </button>
        </div>
      </Tooltip>
    </Link>
  );
};
