import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function BeAgent() {
  return (
    <div className="flex flex-col items-center md:items-start justify-center mt-20 md:flex-row-reverse gap-4 ">
      <div className="max-w-sm md:max-w-md lg:max-w-lg md:text-start p-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          ¿QUERÉS SER AGENTE UP?
        </h1>
        <p className="text-muted-foreground pt-6">
          En RE/MAX UP te ofrecemos la posibilidad de formarte y
          crecer en el mercado inmobiliario, tendrás
          capacitaciones constantes y mantenerte a la vanguardia
          en el sector.
        </p>
        <p className="pt-6 text-gray-900 text-lg">
          ¡Te invitamos a formar parte de este equipo!
        </p>
        <Link href="https://wa.link/cpaq2o">
          <Button className="mt-10 text-1xl p-6 bg-[#003da5] hover:bg-[#0248c0]">
            ME INTERESA
          </Button>
        </Link>
      </div>
      <Image
        alt="gustavo"
        width={380}
        height={1080}
        src="/gustavo.jpg"
      />
    </div>
  );
}

export default BeAgent;
