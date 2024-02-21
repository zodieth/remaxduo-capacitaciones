import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const CoursesPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const courses = await db.course.findMany({
    // usado para traer solo los cursos que creo el usuario logueado
    // where: {
    //   userId,
    // },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
