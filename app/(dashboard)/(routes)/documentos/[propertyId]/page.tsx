"use client";

import { Button } from "@/components/ui/button";
import usePropertiesStore from "@/stores/usePropertiesStore";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "./_components/data-table";
import { DocumentFromTemplate } from "@/types/next-auth";
import { createColumns } from "./_components/columns";

const api = {
  async getPropertyDocuments(propertyId: string) {
    const response = await fetch(
      `/api/documents/fromTemplate/${propertyId}`
    );
    return response.json();
  },
};

const PropertyDetails = ({
  params,
}: {
  params: { propertyId: string };
}) => {
  const router = useRouter();
  const propertyId = params.propertyId;

  const columns = useMemo(
    () => createColumns(propertyId),
    [propertyId]
  );

  const propiedad = usePropertiesStore(state =>
    state.getPropiedadById(propertyId as string)
  );
  const [documents, setDocuments] = useState<
    DocumentFromTemplate[]
  >([]);

  const images = propiedad?.photos.map(photo => photo.cdn);

  useEffect(() => {
    api.getPropertyDocuments(propertyId).then(documents => {
      setDocuments(documents);
    });
  }, [propertyId]);

  const handleClick = () => {
    router.push(
      `/documentos/${propertyId}/documentFromTemplate`
    );
  };

  return (
    <div className="m-3">
      <Link href="/documentos">
        <Button size="sm">
          <ArrowLeft />
          Volver a listado de propiedades
        </Button>
      </Link>
      {propiedad ? (
        <div className="m-4">
          <h1 className="text-2xl font-bold mb-2">
            {propiedad.title}
          </h1>
          <p className="mb-8">
            Dirección: {propiedad.address.displayAddress}
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1" style={{ maxWidth: "35%" }}>
              <div className="grid grid-cols-1 gap-2">
                {images?.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="w-full h-32 relative"
                  >
                    <Image
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">
                Documentos
              </h2>

              <Button onClick={handleClick}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nuevo documento
              </Button>

              <DataTable data={documents} columns={columns} />
            </div>
          </div>
        </div>
      ) : (
        <p>Propiedad no encontrada.</p>
      )}
    </div>
  );
};

export default PropertyDetails;
