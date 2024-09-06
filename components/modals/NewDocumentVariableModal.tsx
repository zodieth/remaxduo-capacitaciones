"use client";

import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { DocumentVariable } from "@/types/next-auth";

interface DocumentVariableModalProps {
  trigger: React.ReactNode;
  onCreate: (
    data: Omit<
      DocumentVariable,
      "id" | "createdAt" | "updatedAt" | "variable"
    >
  ) => void;
}

export const DocumentVariableModal = ({
  trigger,
  onCreate,
}: DocumentVariableModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(`{${name}}`);
  }, [name, setValue]);

  const handleCreateVariable = () => {
    if (!name) {
      toast.error("El nombre de la variable es requerido");
      return;
    }

    onCreate({
      name,
      value,
      description,
    });
    setName("");
    setDescription("");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Crear nueva variable de documento
          </AlertDialogTitle>
        </AlertDialogHeader>

        <label className="block text-sm font-medium text-gray-700">
          Nombre de la variable
        </label>
        <Input
          type="text"
          placeholder="Nombre de la variable"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full"
        />

        <label className="block text-sm font-medium text-gray-700">
          Valor de la variable (autogenerado)
        </label>
        <Input
          type="text"
          disabled
          value={`{${name}}`}
          className="w-full"
        />

        <label className="block text-sm font-medium text-gray-700">
          Descripción (opcional)
        </label>
        <Input
          placeholder="Descripción (opcional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full"
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreateVariable}>
            Crear Variable
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
