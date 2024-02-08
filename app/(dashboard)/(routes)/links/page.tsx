"use client";

import React, { useState, useEffect } from "react";
// import { auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";
// import { db } from "@/lib/db";
import toast from "react-hot-toast";
import { ArrowUpRightSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const fetchUsefulLinks = {
	fetchUsefulLinks: async (): Promise<UsefulLink[]> => {
		const response = await fetch("/api/usefulLink");
		if (!response.ok) {
			toast.error("Error al cargar los links");
			throw new Error("Error al cargar los links");
		}
		return response.json();
	},
};

type UsefulLink = {
	id: string;
	title: string;
	url: string;
	description: string;
};

const UsefulLinks = () => {
	const [usefulLinks, setUsefulLinks] = useState<UsefulLink[]>([]);

	useEffect(() => {
		fetchUsefulLinks.fetchUsefulLinks().then((usefulLinks) => {
			setUsefulLinks(usefulLinks);
		});
	}, []);

	return (
		<div className="m-5 flex flex-col">
			<div className="mb-5">
				<h1 className="font-bold text-2xl">Links útiles</h1>
			</div>
			<div className="flex flex-col justify-start items-start gap-y-4">
				{usefulLinks.map((usefulLink) => (
					<div key={usefulLink.id}>
						<a href={usefulLink.url}>
							<Button>
								<h2 className="text-left">{usefulLink.title}</h2>
								<ArrowUpRightSquare className="w-6 h-6" />
							</Button>
						</a>
						<p className="text-sm text-stone-400 ml-2">
							{usefulLink.description}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default UsefulLinks;
