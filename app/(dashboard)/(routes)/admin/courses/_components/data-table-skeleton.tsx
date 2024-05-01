"use client";

import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

export function DataTableSkeleton() {
  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Skeleton className="py-4 h-[2.5rem] w-[24rem]" />

        <Skeleton className="h-[2.5rem] w-[12rem]" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-[1rem] w-[30rem]" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-[1rem] w-[45rem]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-[2rem] w-[5rem]" />
        <Skeleton className="h-[2rem] w-[6rem]" />
      </div>
    </div>
  );
}
