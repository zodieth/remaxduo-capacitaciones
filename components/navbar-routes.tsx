"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/teacher";

import { SearchInput } from "./search-input";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";

export const NavbarRoutes = () => {
  const { userId } = useAuth();

  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
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
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm">Ir a modo Agente</Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button size="sm">Ir a modo Admin</Button>
          </Link>
        ) : null}
        {/* TODO: Make a button to sign out? */}
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
