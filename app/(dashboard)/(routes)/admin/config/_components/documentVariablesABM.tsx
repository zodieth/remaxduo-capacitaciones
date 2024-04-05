"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { Pencil, Trash } from "lucide-react";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@/components/ui/loadingSpinner";

const api = {
  async fetchDocumentVariables(): Promise<DocumentVariable[]> {
    const response = await fetch("/api/documentVariable");
    if (!response.ok) {
      toast.error("Error al cargar las variables");
      throw new Error("Error al cargar las variables");
    }
    return response.json();
  },
  async createDocumentVariable(
    data: Omit<
      DocumentVariable,
      "id" | "createdAt" | "updatedAt"
    >
  ): Promise<DocumentVariable> {
    const response = await fetch("/api/documentVariable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      toast.error("Error al crear la variable");
      throw new Error("Error al crear la variable");
    }
    return response.json();
  },
  // Asume que tienes endpoints PUT y DELETE implementados
  // para actualizar y eliminar variables, respectivamente.
};

const formSchema = z.object({
  name: z.string().min(1, "Ingrese un nombre"),
  value: z.string().min(1),
  description: z.string().optional(),
  referenceTo: z.string().optional(),
});

interface FormValues {
  name: string;
  value: string;
  description?: string;
  referenceTo?: string;
}

interface DocumentVariable {
  id: string;
  name: string;
  value: string;
  description?: string;
  referenceTo?: string;
}

const DocumentVariablesABM = () => {
  const [documentVariables, setDocumentVariables] = useState<
    DocumentVariable[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const name = watch("name");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
      description: "",
      referenceTo: "",
    },
  });

  // when "name" is modified, update value in form for: {name}
  useEffect(() => {
    setValue("value", `{${name}}`);
  }, [name, setValue]);

  useEffect(() => {
    const fetchVariables = async () => {
      const variables = await api.fetchDocumentVariables();
      setDocumentVariables(variables);
    };
    fetchVariables();
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async data => {
    try {
      const newVariable = await api.createDocumentVariable(data);
      setDocumentVariables(prev => [...prev, newVariable]);
      toast.success("Variable creada con éxito");
      reset(); // Resetea el formulario
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la variable");
    }
  };

  return (
    <div className="mt-10 space-y-4 w-[75%] border border-gray-300 rounded-lg p-6 md:w-1/2">
      <div>
        <h1 className="text-lg font-semibold mb-4">
          Administración de Variables de Documento
        </h1>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  {...register("name", {
                    required: "Este campo es obligatorio",
                  })}
                />
              </FormControl>
              {errors.name && (
                <FormMessage>{errors.name.message}</FormMessage>
              )}
            </FormItem>
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input {...register("value")} disabled />
              </FormControl>
              {/* {errors.value && (
                <FormMessage>{errors.value.message}</FormMessage>
              )} */}
            </FormItem>
            <FormItem>
              <FormLabel>Descripción (opcional)</FormLabel>
              <FormControl>
                <Textarea {...register("description")} />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Referencia (opcional)</FormLabel>
              <FormControl>
                <Input {...register("referenceTo")} />
              </FormControl>
            </FormItem>
            <Button type="submit" className="mt-4">
              Crear Variable
            </Button>
          </form>
        </Form>
      </div>
      {/* Lista de variables existentes */}
      {documentVariables.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-8">
          {documentVariables.map((variable, index) => (
            <div
              key={variable.id}
              className="border-b last:border-b-0"
            >
              <div className="flex justify-between items-center p-2">
                <div>
                  <p>
                    {variable.name}: {variable.value}
                  </p>
                  {variable.description && (
                    <p className="text-sm text-gray-600">
                      {variable.description}
                    </p>
                  )}
                </div>
                <div>
                  {/* Botones para editar y eliminar */}
                  {/* TODO: */}
                  <Button className="mr-2">
                    <Pencil />
                  </Button>
                  <Button>
                    <Trash />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentVariablesABM;
