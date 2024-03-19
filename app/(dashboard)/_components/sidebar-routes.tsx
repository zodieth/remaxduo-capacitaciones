"use client";

import {
  BarChart,
  FileStack,
  Tv2,
  List,
  Settings,
  Link,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";
const guestRoutes = [
  {
    icon: Tv2,
    label: "Capacitaciones",
    href: "/",
  },
  // {
  //   icon: FileStack,
  //   label: "Documentos",
  //   href: "/documentos",
  // },
  {
    icon: Link,
    label: "Links",
    href: "/links",
  },
];

const adminRoutes = [
  {
    icon: List,
    label: "Cursos",
    href: "/admin/courses",
  },
  {
    icon: BarChart,
    label: "Analíticas",
    href: "/admin/analytics",
  },
  {
    icon: Settings,
    label: "Configuración",
    href: "/admin/config",
  },
  {
    icon: User,
    label: "Usuarios",
    href: "/admin/users",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isAdminPage = pathname?.includes("/admin");

  const routes = isAdminPage ? adminRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map(route => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
