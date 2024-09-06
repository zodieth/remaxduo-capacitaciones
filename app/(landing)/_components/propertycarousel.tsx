"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { PropertydApi, Propiedad } from "@/types/next-auth";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCarousel() {
  interface ApiResponde extends Array<PropertydApi> {}

  const fetchProperties = async (): Promise<
    ApiResponde | undefined
  > => {
    const data = await fetch(
      "https://api-ar.redremax.com/remaxweb-ar/api/listings/findAll?page=0&pageSize=10&sort=-createdAt&in:operationId=1,2,3&officeid=AR.42.170&officeName=RE/MAX%20Up&filterCount=0&viewMode=list",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await data.json();

    return json.data.data;
  };

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  return (
    <div className="flex items-center justify-center w-full mt-10 text-gray-900">
      <Carousel
        opts={{
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
        className="w-full max-w-[20rem] md:max-w-[40rem] lg:max-w-6xl"
      >
        <CarouselContent>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-3/3 md:basis-3/6 lg:basis-2/6"
                >
                  <Card className="flex flex-col space-y-3 max-w-[20rem] h-[24rem] md:max-w-md lg:max-w-sm">
                    <Skeleton className="max-w-[20rem] h-[14rem] md:max-w-md lg:max-w-sm" />
                    <div className="space-y-2 p-6">
                      <Skeleton className="h-4 w-[18rem]" />
                      <Skeleton className="h-4 w-[14rem]" />
                      <Skeleton className="h-4 w-[8rem]" />
                    </div>
                  </Card>
                </CarouselItem>
              ))
            : isSuccess
              ? data?.map(prop => {
                  return (
                    <CarouselItem
                      key={prop.id}
                      className="basis-3/3 md:basis-3/6 lg:basis-2/6"
                    >
                      <Link
                        href={`https://www.remax.com.ar/listings/${prop?.slug}`}
                      >
                        <Card className="max-w-[20rem] h-[24rem] md:max-w-md lg:max-w-sm">
                          <CardContent>
                            <div className="relative w-full aspect-video rounded-sm overflow-hidden">
                              <Image
                                fill
                                className="object-cover"
                                alt="aa"
                                src={`https://d1acdg20u0pmxj.cloudfront.net/${prop?.photos[0]?.value}`}
                              />
                            </div>
                            <div className="flex flex-col p-6">
                              <p className="text-sm md:text-base font-normal transition line-clamp-2 text-muted-foreground">
                                {prop?.title}
                              </p>
                              <h1 className="font-extrabold text-xl mt-2">
                                {prop?.price}{" "}
                                {prop?.currency?.value}
                              </h1>
                              <div className="flex flex-row gap-2 mt-1">
                                <p>
                                  {prop?.dimensionTotalBuilt ? (
                                    <>
                                      <strong>
                                        {
                                          prop?.dimensionTotalBuilt
                                        }{" "}
                                      </strong>
                                      m² totales
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </p>
                                <p>
                                  {prop?.dimensionCovered ? (
                                    <>
                                      {" "}
                                      <strong>
                                        {prop?.dimensionCovered}{" "}
                                      </strong>
                                      m² cubiertos
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </p>
                              </div>
                              <div className="flex flex-row mt-1">
                                <p>
                                  <strong className="">
                                    {!prop?.totalRooms
                                      ? ""
                                      : prop?.totalRooms}
                                  </strong>{" "}
                                  {!prop?.totalRooms
                                    ? ""
                                    : prop?.totalRooms > 1
                                      ? "ambientes"
                                      : "ambiente"}
                                </p>
                                <p>
                                  <strong
                                    className={
                                      prop?.totalRooms
                                        ? "pl-2"
                                        : ""
                                    }
                                  >
                                    {!prop?.bathrooms
                                      ? ""
                                      : prop?.bathrooms}
                                  </strong>{" "}
                                  {!prop?.bathrooms
                                    ? ""
                                    : prop?.bathrooms > 1
                                      ? "baños"
                                      : "baño"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  );
                })
              : ""}
          <div className="flex items-center justify-center p-6 w-[20rem]">
            <Link href="https://www.remax.com.ar/listings/buy?page=0&pageSize=24&sort=-createdAt&in:operationId=1,2,3&officeid=AR.42.170&officeName=RE%2FMAX%20Up&filterCount=0&viewMode=listViewMode">
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
              >
                VER MÁS
              </Button>
            </Link>
          </div>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
