"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { PropertydApi } from "@/types/next-auth";
import { PropertyCard } from "@/components/property-card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const PROPIEDADES_API_URL =
  process.env.NEXT_PUBLIC_REMAX_API_PROPIEDADES_URL;

const propertiesSizeFetch = 15;

const fetchPropiedades = {
  fetchPropiedades: async (): Promise<ApiResponse> => {
    const response = await fetch(
      `${PROPIEDADES_API_URL}${propertiesSizeFetch}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REMAX_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Error al cargar las propiedades");
      throw new Error("Error al cargar las propiedades");
    }
    return response.json();
  },
};

interface ApiResponse {
  data: PropertydApi[];
}

const Propiedades = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [propiedades, setPropiedades] = useState<PropertydApi[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadesData =
          await fetchPropiedades.fetchPropiedades();

        // aca no podemos filtrar por Mail....

        // const propiedadesFiltradas =
        //   propiedadesData.data.data.filter(
        //     propiedad =>
        //       propiedad.associate.emails[0].value ===
        //       session?.user?.email
        //   );

        console.log("propiedadesData", propiedadesData.data);
        setPropiedades(propiedadesData.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      }
    };

    fetchData();
  }, [session?.user?.email]);

  return (
    <div className="m-5 flex flex-col">
      <div className="mb-2 mx-6">
        {session?.user?.name ? (
          <h1 className="font-bold text-2xl">
            Propiedades de {session?.user?.name}
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
