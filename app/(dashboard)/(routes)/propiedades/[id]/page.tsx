"use client";
import { PropertyCardDetail } from "@/components/property-card-detail";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Propiedad } from "@/types/next-auth";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ApiResponse {
  data: {
    data: Propiedad[];
  };
}

export default function Page() {
  const router = useParams();

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

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [propiedad, setPropiedad] = useState<Propiedad[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadesData =
          await fetchPropiedades.fetchPropiedades();

        const propiedadesFiltradas =
          propiedadesData.data.data.filter(
            propiedad => propiedad.id === router.id
          );

        setPropiedad(propiedadesFiltradas);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      }
    };

    fetchData();
  }, [session?.user?.email]);

  console.log(propiedad);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : propiedad?.length ? (
        propiedad.map(propiedad => (
          <div className=" m-4 flex flex-col items-center justify-start gap-4 md:flex-row">
            <PropertyCardDetail
              displayAddress={propiedad.displayAddress}
              key={propiedad.id}
              id={propiedad.id}
              title={propiedad.title}
              slug={propiedad.slug}
              photo={propiedad.photos[0].value}
              price={propiedad.price}
              currency={propiedad.currency.value}
              agent={propiedad.associate.name}
            />
            <div>Adjuntar documentos</div>
          </div>
        ))
      ) : !propiedad?.length ? (
        <h1 className=" text-1xl">
          No se encontraró la propiedad
        </h1>
      ) : (
        ""
      )}
    </div>
  );
}
