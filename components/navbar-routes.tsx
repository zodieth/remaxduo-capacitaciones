"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/isAdminCheck";

import { SearchInput } from "./search-input";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";

export const NavbarRoutes = () => {
  const { role } = useAuth();

  console.log("si es admin: ", isAdmin(role), "role: ", role);
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  const handleLogOut = async () => {
    await signOut();
  };

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex gap-x-2 ml-auto">
        {isAdminPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm">Ir a modo Agente</Button>
          </Link>
        ) : isAdmin(role) ? (
          <Link href="/teacher/courses">
            <Button size="sm">Ir a modo Admin</Button>
          </Link>
        ) : null}
      </div>
      {/* button de logout */}
      <div className="ml-5">
        <Link href="/">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLogOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </Link>
      </div>
    </>
  );
};
