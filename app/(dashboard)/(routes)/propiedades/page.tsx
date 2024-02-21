"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ArrowUpRightSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Propiedad } from "@/types/next-auth";
import { PropertyCard } from "@/components/property-card";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { SearchInput } from "@/components/search-input";

const fetchPropiedades = {
  fetchPropiedades: async (): Promise<ApiResponse> => {
    const response = await fetch(
      "https://api-ar.redremax.com/remaxweb-ar/api/listings/findAll?page=0&pageSize=500&sort=-createdAt&in:operationId=1,2,3&officeid=AR.42.170&officeName=RE/MAX%20Up&filterCount=0&viewMode=list"
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

  const [propiedades, setPropiedades] = useState<Propiedad[]>(
    []
  );
  useEffect(() => {
    fetchPropiedades.fetchPropiedades().then(propiedades => {
      setPropiedades(propiedades.data.data);
    });
  }, []);

  const filterPropertiesByAgent = async () => {
    const propiedadesFiltradas = propiedades?.filter(
      propiedad => {
        return (
          propiedad.associate.emails[0].value ===
          session?.user?.email
        );
      }
    );
  };
  filterPropertiesByAgent();

  return (
    <div className="m-5 flex flex-col">
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="mb-5">
        <h1 className="font-bold text-2xl">Mis propiedades</h1>
      </div>
      <div className="p-6 w-full border border-gray-300 rounded-lg grid md:grid-cols-3 gap-4">
        {propiedades.length ? (
          propiedades.map(propiedad => (
            <PropertyCard
              id={propiedad.id}
              title={propiedad.title}
              slug={propiedad.slug}
            />
          ))
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};

export default Propiedades;
