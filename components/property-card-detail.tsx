import Link from "next/link";
import { Home, DollarSign, User } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";

import Image from "next/image";

type PropertyCard = {
  id: string;
  title: string;
  slug: string;
  photo: string;
  displayAddress: string;
  price: number;
  currency: string;
  agent: string;
};

export const PropertyCardDetail = ({
  id,
  title,
  slug,
  photo,
  displayAddress,
  price,
  currency,
  agent,
}: PropertyCard) => {
  return (
    <Link href={`/documentos/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt={title}
            src={`https://d1acdg20u0pmxj.cloudfront.net/${photo}`}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{slug}</p>
          <div className="my-2 flex flex-col items-start gap-4 text-sm md:text-xs">
            <div className="flex items-center gap-x-2 text-slate-500">
              <IconBadge size="sm" icon={Home} />
              <span>Dirección: {displayAddress}</span>
            </div>
            <div className="flex items-center gap-x-2 text-slate-500">
              <IconBadge size="sm" icon={DollarSign} />
              <span>
                Precio: ${price} {currency}
              </span>
            </div>
            <div className="flex items-center gap-x-2 text-slate-500">
              <IconBadge size="sm" icon={User} />
              <span>Agente: {agent}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
