import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavBar from "./navbar";

function Header() {
  return (
    <header className="absolute left-0 right-0  top-0 z-[100] flex w-full flex-col items-center transition-colors  duration-[350ms] ease-in-out will-change-transform bg-[#222222]">
      <div className="flex h-[45px] w-full items-center justify-center bg-lemon text-center text-[0.7rem] font-medium leading-[1.14] tracking-[-0.01em] text-midnight sm:text-[0.875rem] text-white">
        <div className="relative group flex items-center gap-[10px]">
          <span>up@remax.com.ar</span>
          <div className="absolute bottom-0 left-0 h-px w-full translate-y-1 bg-midnight opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"></div>
        </div>
      </div>
      <div>
        <NavBar />
      </div>
    </header>
  );
}

export default Header;
