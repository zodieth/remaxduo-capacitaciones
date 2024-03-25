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
  // Directamente invoca el selector con el estado actual.
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
        <div className=" m-4">
          <h1 className="text-2xl font-bold mb-2">
            {propiedad.title}
          </h1>
          <p className="mb-8">
            Dirección: {propiedad.address.displayAddress}
          </p>
          <p>Descripcion: </p>
          <p className="mb-4">{propiedad.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images?.map((image, index) => (
              <div key={index} className="max-w-sm mx-auto">
                <Image
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  width={600}
                  height={400}
                  layout="responsive"
                  className="rounded-lg shadow-lg"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Propiedad no encontrada.</p>
      )}
    </div>
  );
};

export default PropertyDetails;
