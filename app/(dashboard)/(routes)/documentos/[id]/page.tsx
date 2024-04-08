"use client";

import { Button } from "@/components/ui/button";
import usePropertiesStore from "@/stores/usePropertiesStore";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PropertyDetails = ({
  params,
}: {
  params: { id: string };
}) => {
  const id = params.id;
  const propiedad = usePropertiesStore(state =>
    state.getPropiedadById(id as string)
  );

  const images = propiedad?.photos.map(photo => photo.cdn);

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
              <ul>
                <li>Contrato de arrendamiento</li>
                <li>Documento de propiedad</li>
                <li>Últimos recibos de servicios</li>
                <li>Documento de reglas de la comunidad</li>
              </ul>
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
