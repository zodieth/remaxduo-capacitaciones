"use client";

import {
  BarChart,
  FileStack,
  Layout,
  List,
  Settings,
  Link,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Tablero",
    href: "/",
  },
  {
    icon: FileStack,
    label: "Documentos",
    href: "/search",
  },
  {
    icon: Link,
    label: "Links",
    href: "/links",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Cursos",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analíticas",
    href: "/teacher/analytics",
  },
  {
    icon: Settings,
    label: "Configuración",
    href: "/teacher/config",
  },
  {
    icon: User,
    label: "Usuarios",
    href: "/teacher/users",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isAdminPage = pathname?.includes("/teacher");

  const routes = isAdminPage ? teacherRoutes : guestRoutes;

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
