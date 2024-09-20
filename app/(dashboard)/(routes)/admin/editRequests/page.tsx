"use client";

import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  DocumentFromTemplate,
  DocumentStatus,
  PropertydApi,
} from "@/types/next-auth";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useRouter } from "next/navigation";
import { createColumns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const api = {
  fetchPendingDocuments: async (): Promise<
    DocumentFromTemplate[]
  > => {
    const response = await fetch("/api/documents/pending");
    if (!response.ok) {
      toast.error("Error al cargar las propiedades");
      throw new Error("Error al cargar las propiedades");
    }
    return response.json();
  },
};

const EditRequests = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const agentId = session?.user?.agentId || "";
  const user = session?.user;
  const [loading, setLoading] = useState(true);

  const propertyId = "49";

  const columns = useMemo(() => createColumns(), []);

  const [documents, setDocuments] = useState<
    DocumentFromTemplate[]
  >([]);

  useEffect(() => {
    api.fetchPendingDocuments().then(documents => {
      setDocuments(documents);
      setLoading(false);
    });
  }, []);

  return (
    <div className="m-5 flex flex-col">
      <div className="p-6 w-full">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="mb-2 mx-6">
              {user?.name ? (
                <h1 className="font-bold text-2xl">
                  Solicitudes de Edición
                </h1>
              ) : (
                ""
              )}
            </div>
            <DataTable data={documents} columns={columns} />
          </>
        )}
      </div>
    </div>
  );
};

export default EditRequests;
