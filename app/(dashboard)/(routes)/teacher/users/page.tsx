//users
// nombre - mail - foto de perfil - rol
// roles: agente - administrador
import { redirect } from "next/navigation";
import { User } from "lucide-react";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const CoursesPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session.user.id;

  if (!userId) {
    return redirect("/");
  }

  // const users = await db.user.findMany({
  // 	where: {
  // 		userId,
  // 	},
  // 	orderBy: {
  // 		createdAt: "desc",
  // 	},
  // });

  const users = [
    {
      id: "alina1",
      image: <User />,
      name: "Alina Piccardo",
      email: "apiccardo@ltmsoftware.com",
      role: "administrador",
    },
    {
      id: "rodri31",
      image: <User />,
      name: "Rodrigo Marchese",
      email: "rmarchese@ltmsoftware.com",
      role: "administrador",
    },
    {
      id: "camila3331",
      image: <User />,
      name: "Camila Cairo",
      email: "ccairo@ltmsoftware.com",
      role: "agente",
    },
    {
      id: "mora98821",
      image: <User />,
      name: "Mora Piccardo",
      email: "mpiccardo@ltmsoftware.com",
      role: "agente",
    },
  ];

  return (
    <div className="p-6">
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default CoursesPage;
