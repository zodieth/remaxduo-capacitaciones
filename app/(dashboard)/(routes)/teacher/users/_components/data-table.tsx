"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  PlusCircle,
  Trash,
  Pencil,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserManagement } from "./user-manage";
import { User } from "./user-manage";
import toast from "react-hot-toast";
import { User as UserIcon } from "lucide-react";

const api = {
  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`/api/user/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el usuario");
    }
  },
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | User[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [selectedUser, setSelectedUser] = useState<
    User | undefined
  >(undefined);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => setUsers(data as any), [data]);

  const table = useReactTable({
    data: users as any,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsDropdownOpen(true);
  };

  const handleFormCancel = (isCanceled: boolean) => {
    setIsDropdownOpen(!isCanceled);
    isCanceled && setSelectedUser(undefined);
    setUsers(users);
  };

  const handleDelete = (user: User) => {
    const id = user.id;

    id &&
      api
        .deleteUser(id)
        .then(() => toast.success("Usuario eliminado"));

    const newData = users.filter((user: User) => user.id !== id);
    setUsers(newData);
  };

  const handleRefreshUsers = (user: any) => {
    // check if user is alrready in users list by id
    // if it is, update the user in the users list
    const userExists = users.find((u: User) => u.id === user.id);
    let updatedUsers = users;

    if (!userExists) {
      // add the user to the users list
      updatedUsers = [...users, user];
    } else {
      // update the user in the users list
      updatedUsers = users.map((u: User) => {
        if (u.id === user.id) {
          return user;
        }
        return u;
      });
    }
    setUsers(updatedUsers);
  };

  return (
    <div>
      <div className="flex w-full items-center py-4 justify-end">
        <div className="relative justify-end text-end w-1/2">
          <Button onClick={() => setIsDropdownOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Crear usuario
          </Button>
          <div className="text-start">
            {isDropdownOpen && (
              <UserManagement
                onCancel={handleFormCancel}
                user={selectedUser}
                handleRefreshUsers={handleRefreshUsers}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2 w-full pb-4">
        <Input
          placeholder="Filtrar usuarios..."
          value={
            (table
              .getColumn("name")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table
              .getColumn("name")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={
                    row.getIsSelected() && "seleccionado"
                  }
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleEditUser(row.original as User)
                        }
                        className="text-sm"
                      >
                        <Pencil className="h-4 w-4 " />
                      </Button>
                      <Button
                        onClick={() =>
                          handleDelete(row.original as User)
                        }
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
