import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavBar from "./navbar";

function Header() {
  return (
    <header className="absolute left-0 right-0  top-0 z-[100] flex w-full flex-col items-center transition-colors  duration-[350ms] ease-in-out will-change-transform bg-[#222222] false false  false border-b !border-midnight/5">
      <div className="flex h-[45px] w-full items-center justify-center bg-lemon text-center text-[0.7rem] font-medium leading-[1.14] tracking-[-0.01em] text-midnight sm:text-[0.875rem] text-white">
        <a
          className="group flex items-center gap-[10px]"
          href="/reports-and-guides/the-math-of-sales-calculator"
        >
          <div className="relative">
            <span>Remax Up</span>
            <div className="absolute bottom-0 left-0 h-px w-full translate-y-1 bg-midnight opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"></div>
          </div>
          <span className="mt-[-2px]">
            <svg
              width="26"
              height="17"
              viewBox="0 0 26 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.0566406"
                y="0.933105"
                width="25.0347"
                height="16.0222"
                rx="1.00139"
                fill="#160828"
              ></rect>
              <path
                d="M16.2011 9.24658H8.24219"
                stroke="white"
                stroke-width="1.13599"
                stroke-linecap="round"
                stroke-linejoin="bevel"
              ></path>
              <path
                d="M12.9673 13.1846L16.9053 9.24658L12.9673 5.30857"
                stroke="white"
                stroke-width="1.13599"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </span>
        </a>
      </div>
      <div>
        <NavBar />
      </div>
    </header>
  );
}

export default Header;
