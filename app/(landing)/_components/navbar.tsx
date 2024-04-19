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
    <div className="fixed left-0 w-full z-10 duration-300">
      <div className="max-w-[1240px] m-auto flex justify-between items-center p-4 text-black">
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
            <Link href="/">Oficina</Link>
          </li>
          <li className="p-4">
            <Link href="/">Nosotros</Link>
          </li>
        </ul>

        <div
          onClick={() => handleNav()}
          className="block sm:hidden z-10 cursor-pointer"
        >
          {nav ? (
            <XIcon className="text-white" size={20} />
          ) : (
            <Menu size={20} />
          )}
        </div>
        <div
          className={
            nav
              ? "sm:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-black text-white text-center ease-in duration-300"
              : "sm:hidden absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-black text-white text-center ease-in duration-300"
          }
        >
          <ul>
            <li className="p-4 text-4xl hover:text-gray-500">
              <Link href="/">Inicio</Link>
            </li>
            <li className="p-4 text-4xl hover:text-gray-500">
              <Link href="/">Oficina</Link>
            </li>
            <li className="p-4 text-4xl hover:text-gray-500">
              <Link href="/">Nosotros</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
