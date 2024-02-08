import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CategoriesABM from "./_components/categoriesABM";
import UsefulLinksABM from "./_components/usefulLinksABM";

const ConfigPage = async () => {
	const { userId } = auth();

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
