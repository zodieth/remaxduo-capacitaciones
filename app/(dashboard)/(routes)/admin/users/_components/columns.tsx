"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  image: JSX.Element;
  name: string;
  email: string;
  role: string;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "image",
    header: () => {
      return <Button variant="ghost"></Button>;
    },
    cell: ({ row }) => {
      return <div>{row.original.image}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Rol
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isAdmin = row.original.role === "ADMIN";
      const isAgent = row.original.role === "USER";

      let roleName;
      if (isAdmin) {
        roleName = "Administrador";
      } else if (isAgent) {
        roleName = "Agente";
      }

      const backgroundColor = isAdmin
        ? "bg-red-600 rounded-full px-2 py-1"
        : isAgent
          ? "bg-blue-800 rounded-full px-2 py-1"
          : "";

      return (
        <div className="flex items-center justify-start text-white">
          <p className={backgroundColor}>{roleName}</p>
        </div>
      );
    },
  },
];
