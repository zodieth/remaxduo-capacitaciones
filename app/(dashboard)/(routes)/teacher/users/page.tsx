import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { User } from "./_components/user-manage";
import { db } from "@/lib/db";

const UsersPage = async () => {
  const users = await db.user.findMany();

  return (
    <div className="p-6">
      <DataTable columns={columns} data={users as User[]} />
    </div>
  );
};

export default UsersPage;
