"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Propiedad } from "@/types/next-auth";
import { PropertyCard } from "@/components/property-card";
import LoadingSpinner from "@/components/ui/loadingSpinner";

const fetchPropiedades = {
  fetchPropiedades: async (): Promise<ApiResponse> => {
    const response = await fetch(
      "https://api-ar.redremax.com/remaxweb-ar/api/listings/findAll?page=0&pageSize=200&sort=-createdAt&in:operationId=1,2,3&officeid=AR.42.170&officeName=RE/MAX%20Up&filterCount=0&viewMode=list"
    );
    if (!response.ok) {
      toast.error("Error al cargar las propiedades");
      throw new Error("Error al cargar las propiedades");
    }
    return response.json();
  },
};

interface ApiResponse {
  data: {
    data: Propiedad[];
  };
}

const Propiedades = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [propiedades, setPropiedades] = useState<Propiedad[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadesData =
          await fetchPropiedades.fetchPropiedades();

        const propiedadesFiltradas =
          propiedadesData.data.data.filter(
            propiedad =>
              propiedad.associate.emails[0].value ===
              session?.user?.email
          );

        setPropiedades(propiedadesFiltradas);
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
      <div className="p-6 w-full grid md:grid-cols-3 gap-4 lg:grid-cols-4">
        {loading ? (
          <LoadingSpinner />
        ) : propiedades.length ? (
          propiedades.map(propiedad => (
            <PropertyCard
              key={propiedad.id}
              id={propiedad.id}
              title={propiedad.title}
              slug={propiedad.slug}
            />
          ))
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
