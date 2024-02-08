"use client";

import { BarChart, Compass, Layout, List, Settings, Link } from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
	{
		icon: Layout,
		label: "Tablero",
		href: "/",
	},
	{
		icon: Compass,
		label: "Buscar",
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
];

export const SidebarRoutes = () => {
	const pathname = usePathname();

	const isTeacherPage = pathname?.includes("/teacher");

	const routes = isTeacherPage ? teacherRoutes : guestRoutes;

	return (
		<div className="flex flex-col w-full">
			{routes.map((route) => (
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
