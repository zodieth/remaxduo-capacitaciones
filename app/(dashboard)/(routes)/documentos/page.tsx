"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { PropertydApi } from "@/types/next-auth";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import {
  jwtHandler,
  refreshTokenJWT,
} from "@/components/jwtHandler";

const PROPIEDADES_API_URL =
  process.env.NEXT_PUBLIC_REMAX_API_PROPIEDADES_URL;

const fetchPropiedades = async (
  agentId: string
): Promise<ApiResponse | undefined> => {
  let token = localStorage.getItem("remax-token") || "";
  const { valid, expired } = await jwtHandler(token);

  if (expired || !valid) {
    const tokenToast = toast.loading(
      "Token expirado. Refrescando..."
    );
    const newToken = await refreshTokenJWT();

    newToken && (token = newToken) && toast.dismiss(tokenToast);
  }

  try {
    const response = await fetch(
      `${PROPIEDADES_API_URL}&agent=${agentId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Error al cargar las propiedades");
      throw new Error("Error al cargar las propiedades");
    }

    return response.json();
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
  }
};

interface ApiResponse {
  data: PropertydApi[];
}

const Propiedades = () => {
  const { data: session } = useSession();
  const agentId = session?.user?.agentId || "";
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [propiedades, setPropiedades] = useState<PropertydApi[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadesData = await fetchPropiedades(agentId);

        if (!propiedadesData) {
          toast.error("No se encontraron propiedades");
          return;
        }

        if (propiedadesData) {
          console.log("propiedadesData", propiedadesData.data);
          setPropiedades(propiedadesData.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      }
    };

    fetchData();
  }, [user?.email, agentId]);

  return (
    <div className="m-5 flex flex-col">
      <div className="mb-2 mx-6">
        {user?.name ? (
          <h1 className="font-bold text-2xl">
            Propiedades de {user?.name}
          </h1>
        ) : (
          ""
        )}
      </div>
      <div className="p-6 w-full">
        {loading ? (
          <LoadingSpinner />
        ) : propiedades.length ? (
          <DataTable data={propiedades} columns={columns} />
        ) : !propiedades.length ? (
          <h1 className=" text-1xl">
            No se encontraron propiedades
          </h1>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Propiedades;
