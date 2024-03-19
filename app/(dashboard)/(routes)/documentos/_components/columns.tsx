"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PropertydApi } from "@/types/next-auth";
import Link from "next/link";

export const columns: ColumnDef<PropertydApi>[] = [
  {
    accessorKey: "propertyTypeV2",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Propiedad
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "address.displayAddress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Dirección
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      console.log(row);
      const {
        id,
        propertyTypeV2,
        address,
        photos,
        description,
      } = row.original;
      const addressToDisplay = address.displayAddress;
      console.log("address", address);
      console.log("addressToDisplay", addressToDisplay);
      const photoUrl = photos[0]?.cdn;

      const href = `/documentos/${id}/property-details?propertyTypeV2=${encodeURIComponent(propertyTypeV2)}&description=${encodeURIComponent(description)}&photoUrl=${encodeURIComponent(photoUrl)}&addressToDisplay=${encodeURIComponent(addressToDisplay)}`;
      // const href = `/documentos/${id}/property-details?propertyTypeV2=${encodeURIComponent(propertyTypeV2)}`;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={href}>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
