"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  PropertyCreateDTO,
  PropertydApi,
} from "@/types/next-auth";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import {
  jwtHandler,
  refreshTokenJWT,
} from "@/components/jwtHandler";
import usePropertiesStore from "@/stores/usePropertiesStore";
import { Property } from "@prisma/client";
import { DataTableAuthorizations } from "./_components/data-table-authorizations";
import { authorizationColumns } from "./_components/authorizationColumns";
import { Document } from "@prisma/client";

const PROPIEDADES_API_URL =
  process.env.NEXT_PUBLIC_REMAX_API_PROPIEDADES_URL;

const api = {
  fetchProperties: async (): Promise<Property[]> => {
    const response = await fetch("/api/property");
    if (!response.ok) {
      toast.error("Error al cargar las propiedades");
      throw new Error("Error al cargar las propiedades");
    }
    return response.json();
  },
  postProperties: async (
    properties: PropertyCreateDTO[]
  ): Promise<void> => {
    const response = await fetch("/api/property", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(properties),
    });
    if (!response.ok) {
      toast.error("Error al crear las propiedades");
      throw new Error("Error al crear las propiedades");
    }
    return response.json();
  },
  // TODO: fetch documents with no property ID.
  async getAuthotizationDocuments() {
    const response = await fetch(
      "/api/documents/authorizations"
    );
    return response.json();
  },
};

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

  if (agentId) {
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
  const [propiedades, setPropiedades] = useState<Property[]>([]);
  const [authDocuments, setAuthDocuments] = useState<Document[]>(
    []
  );

  const setPropiedadesToStore = usePropertiesStore(
    state => state.setPropiedades
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadesData = await fetchPropiedades(agentId);

        const propiedadesDB = await api.fetchProperties();

        if (propiedadesDB) {
          setPropiedades(propiedadesDB);
          setPropiedadesToStore(propiedadesDB);
          setLoading(false);
          // parse propiedadesData to Property[]
        }

        if (propiedadesData) {
          const propiedades = propiedadesData.data.map(
            (prop: PropertydApi) => {
              return {
                mlsid: prop.mlsid,
                title: prop.title,
                address: prop.address.displayAddress,
                photos: prop.photos.map(
                  photo => photo.cdn as string
                ),
                createdAt: new Date(),
                updatedAt: new Date(),
              };
            }
          );

          await api.postProperties(propiedades);
        }

        // if (!propiedadesData) {
        //   toast.error("No se encontraron propiedades");
        //   return;
        // }
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      }
    };

    const fetchAuthotizationDocuments = async () => {
      try {
        const authDocuments =
          await api.getAuthotizationDocuments();
        console.log(authDocuments);
        setAuthDocuments(authDocuments);
      } catch (error) {
        console.error(
          "Error al obtener documentos de autorización:",
          error
        );
      }
    };

    fetchData();
    fetchAuthotizationDocuments();
  }, [user?.email, agentId, setPropiedadesToStore]);

  return (
    <div className="m-5 flex flex-col">
      {/* <div className="mb-2 mx-6">
        {user?.name ? (
          <h1 className="font-bold text-2xl">
            Propiedades de {user?.name}
          </h1>
        ) : (
          ""
        )}
      </div> */}
      <div className="p-6 w-full">
        {loading ? (
          <LoadingSpinner />
        ) : propiedades.length ? (
          <>
            <div className="mb-2 mx-6">
              {user?.name ? (
                <h1 className="font-bold text-2xl">
                  Autorizaciones de {user?.name}
                </h1>
              ) : (
                ""
              )}
            </div>
            <DataTableAuthorizations
              data={authDocuments}
              columns={authorizationColumns}
            />
            <div className="mb-2 mx-6">
              {user?.name ? (
                <h1 className="font-bold text-2xl">
                  Propiedades de {user?.name}
                </h1>
              ) : (
                ""
              )}
            </div>
            <DataTable data={propiedades} columns={columns} />
          </>
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
