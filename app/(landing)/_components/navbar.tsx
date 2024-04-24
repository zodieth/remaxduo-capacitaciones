import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Menu, XIcon } from "lucide-react";
function NavBar() {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className="fixed left-0 w-full z-10 duration-300 text-white">
      <div className="max-w-[1240px] m-auto flex justify-between items-center p-4 ">
        <Link href="/">
          <Image
            alt="logo"
            width={150}
            height={150}
            src="/logo.png"
          />
        </Link>
        <ul className="hidden sm:flex ">
          <li className="p-4">
            <Link href="/">Inicio</Link>
          </li>
          <li className="p-4">
            <Link href="https://www.google.com/maps/place/Remax+Up/@-34.5069239,-58.5315408,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb1c7a39a11a3:0x87aa6ff0aa949b2a!8m2!3d-34.5069239!4d-58.5289605!16s%2Fg%2F11rq3gmdqr?entry=ttu">
              Oficina
            </Link>
          </li>
          <li className="p-4">
            <Link href="https://www.remax.com.ar/up">
              Nosotros
            </Link>
          </li>
          <li className="p-4">
            <Link href="/dashboard">Exclusivo agentes</Link>
          </li>
        </ul>

        <div
          onClick={() => handleNav()}
          className="block sm:hidden z-10 cursor-pointer"
        >
          {nav ? (
            <XIcon className="text-white" size={30} />
          ) : (
            <Menu size={30} />
          )}
        </div>
        <div
          className={
            nav
              ? "sm:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-[#222222] text-white text-center ease-in duration-300"
              : "sm:hidden absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-[#222222] text-white text-center ease-in duration-300"
          }
        >
          <ul className="">
            <li className="p-4 text-4xl hover:text-gray-500">
              <Link href="/">Inicio</Link>
            </li>
            <li className="p-4 text-4xl hover:text-gray-500">
              <Link href="https://www.google.com/maps/place/Remax+Up/@-34.5069239,-58.5315408,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb1c7a39a11a3:0x87aa6ff0aa949b2a!8m2!3d-34.5069239!4d-58.5289605!16s%2Fg%2F11rq3gmdqr?entry=ttu">
                Oficina
              </Link>
            </li>
            <li className="p-4 text-4xl hover:text-gray-500">
              <Link href="https://www.remax.com.ar/up">
                Nosotros
              </Link>
            </li>
            <li className="p-4 text-4xl hover:text-gray-500">
              <Link href="/dashboard">Exclusivo agentes</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
