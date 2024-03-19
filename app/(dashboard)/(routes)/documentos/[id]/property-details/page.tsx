"use client";

import { useSearchParams } from "next/navigation";

import Image from "next/image";

const PropertyDetails = () => {
  const searchParams = useSearchParams();

  const propertyTypeV2 = searchParams.get("propertyTypeV2");
  const photoUrl = searchParams.get("photoUrl");
  const addressToDisplay = searchParams.get("addressToDisplay");
  const description = searchParams.get("description");

  console.log("photoUrl", photoUrl);

  console.log("propertyTypeV2", propertyTypeV2);
  console.log("addressToDisplay", addressToDisplay);

  return (
    <div className="m-2 p-4">
      {photoUrl && (
        <Image
          width={500}
          height={500}
          src={decodeURIComponent(photoUrl as string)}
          alt="Foto principal de la propiedad"
        />
      )}
      <h1>{decodeURIComponent(propertyTypeV2 as string)}</h1>
      <p>
        <strong>Dirección:</strong>{" "}
        {decodeURIComponent(addressToDisplay as string)}
      </p>
      <p className="m-6">
        {decodeURIComponent(description as string)}
      </p>
    </div>
  );
};

export default PropertyDetails;
