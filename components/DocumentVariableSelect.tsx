"use client";

import React, { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DocumentVariable } from "@/types/next-auth";
import { DocumentVariableModal } from "./modals/NewDocumentVariableModal";
import toast from "react-hot-toast";

export function DocumentVariableSelect({
  documentVariables,
  selectedDocumentVariable,
  setSelectedDocumentVariable,
  createDocumentVariable,
}: {
  documentVariables: DocumentVariable[];
  selectedDocumentVariable: DocumentVariable | null;
  setSelectedDocumentVariable: (
    variable: DocumentVariable | null
  ) => void;
  createDocumentVariable: (
    data: Omit<
      DocumentVariable,
      "id" | "createdAt" | "updatedAt"
    >
  ) => Promise<void>;
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleSelectChange = (value: string) => {
    if (value === "newVariable") {
      triggerRef.current && triggerRef.current.click();
    } else {
      const selectedVar = documentVariables.find(
        variable => variable.id === value
      );
      setSelectedDocumentVariable(selectedVar || null);
    }
  };

  return (
    <>
      <Select
        value={
          selectedDocumentVariable
            ? selectedDocumentVariable.id
            : ""
        }
        onValueChange={handleSelectChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecciona una variable" />
        </SelectTrigger>
        <SelectContent>
          {documentVariables.map(variable => (
            <SelectItem key={variable.id} value={variable.id}>
              {variable.name}
            </SelectItem>
          ))}
          <SelectItem
            value="newVariable"
            className="text-blue-500 bg-gray-100"
          >
            Crear nueva variable...
          </SelectItem>
        </SelectContent>
      </Select>
      <DocumentVariableModal
        trigger={
          <Button ref={triggerRef} style={{ display: "none" }}>
            Crear Variable
          </Button>
        }
        onCreate={async (data: any) => {
          await createDocumentVariable(data);
          toast.success("Variable creada con éxito");
        }}
      />
    </>
  );
}
