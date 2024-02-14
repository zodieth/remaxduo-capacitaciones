import { redirect } from "next/navigation";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// async function getUsers() {
//   const response = await fetch("/api/user");
//   if (!response.ok) {
//     throw new Error("Error al cargar los usuarios");
//   }
//   return response.json();
// }

const CoursesPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session.user.id;

  if (!userId) {
    return redirect("/");
  }

  // const data = await fetch("/api/user");
  // const users = await data.json();

  // const users = await getUsers();
  // console.log(users);

  // const users = [
  //   {
  //     id: "alina1",
  //     image: <User />,
  //     name: "Alina Piccardo",
  //     email: "apiccardo@ltmsoftware.com",
  //     role: "administrador",
  //   },
  //   {
  //     id: "rodri31",
  //     image: <User />,
  //     name: "Rodrigo Marchese",
  //     email: "rmarchese@ltmsoftware.com",
  //     role: "administrador",
  //   },
  //   {
  //     id: "camila3331",
  //     image: <User />,
  //     name: "Camila Cairo",
  //     email: "ccairo@ltmsoftware.com",
  //     role: "agente",
  //   },
  //   {
  //     id: "mora98821",
  //     image: <User />,
  //     name: "Mora Piccardo",
  //     email: "mpiccardo@ltmsoftware.com",
  //     role: "agente",
  //   },
  // ];

  return (
    <div className="p-6">
      <DataTable columns={columns} data={[]} />
    </div>
  );
};

export default CoursesPage;
