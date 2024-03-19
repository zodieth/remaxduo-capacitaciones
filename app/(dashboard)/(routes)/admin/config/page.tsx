import { redirect } from "next/navigation";
import CategoriesABM from "./_components/categoriesABM";
import UsefulLinksABM from "./_components/usefulLinksABM";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ConfigPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <CategoriesABM />
      <UsefulLinksABM />
    </div>
  );
};

export default ConfigPage;
