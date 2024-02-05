import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CategoriesABM from "./_components/categoriesABM";

const ConfigPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <CategoriesABM />
    </div>
  );
};

export default ConfigPage;
