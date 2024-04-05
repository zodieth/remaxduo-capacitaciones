"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import TextEditor from "@/components/TextEditor";
import { DocumentVariable } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/components/ui/loadingOverlay";
import { DocumentToSend } from "../create/page";
import Link from "next/link";

const api = {
  async getDocumentVariables(): Promise<DocumentVariable[]> {
    const response = await fetch("/api/documentVariable");
    return response.json();
  },
};

type FormValues = {
  title: string;
  description: string;
};

const formSchema = z.object({
  title: z.string().min(1, "Ingrese un título"),
  description: z.string().optional(),
});

const DocumentTemplateEditor = ({
  onCreate,
  onEdit,
  documentTemplateId,
  documentTemplateState,
}: {
  onCreate?: (documentToSend: DocumentToSend) => void;
  onEdit?: (documentToSend: DocumentToSend) => void;
  documentTemplateId?: string;
  documentTemplateState?: DocumentToSend;
}) => {
  console.log("documentTemplateState: ", documentTemplateState);
  const router = useRouter();
  const [documentVariables, setDocumentVariables] = useState<
    DocumentVariable[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const [document, setDocument] = useState<DocumentToSend>({
    title: documentTemplateState?.title || "",
    content: documentTemplateState?.content || "",
    description: documentTemplateState?.description || "",
    variablesIds: documentTemplateState?.variablesIds || [],
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: documentTemplateState
      ? {
          title: documentTemplateState.title,
          description: documentTemplateState.description,
        }
      : {
          title: "",
          description: "",
        },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = form;

  const description = watch("description");
  const title = watch("title");

  useEffect(() => {
    setDocument(prev => ({
      ...prev,
      title: title,
      description: description,
    }));
  }, [title, description]);

  useEffect(() => {
    api.getDocumentVariables().then(variables => {
      setDocumentVariables(variables);
    });
  }, []);

  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    setIsLoading(true);

    const variablesExtractedFromContent =
      document.content.match(/{([^}]+)}/g);
    const variablesUsedIds = documentVariables
      .filter(variable =>
        variablesExtractedFromContent?.includes(
          `{${variable.name}}`
        )
      )
      .map(variable => variable.id);

    const documentToSend = {
      ...document,
      variablesIds: variablesUsedIds,
    };

    if (onCreate && !documentTemplateState) {
      onCreate(documentToSend);
    }

    if (onEdit && documentTemplateState) {
      onEdit(documentToSend);
    }
  };

  // Función para actualizar solo el HTML en el estado del documento
  const updateDocumentContent = (html: string) => {
    setDocument(prev => ({ ...prev, content: html }));
  };

  return (
    <div className="p-6">
      {isLoading && <LoadingOverlay />}
      <div className="flex justify-between items-center">
        {onCreate ? (
          <h1>Crear Plantilla</h1>
        ) : (
          <h1>Editar Plantilla</h1>
        )}
      </div>
      <div className="mt-10 w-[100%] border border-gray-300 rounded-lg p-6 ">
        {/* form for titulo y descripcion del documento */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mt-5 mb-5">
              <Link href="/admin/documentTemplates">
                <Button>Volver a Plantillas</Button>
              </Link>

              <Button type="submit" className="m-2">
                {onCreate
                  ? "Crear plantilla"
                  : "Actualizar plantilla"}
              </Button>
            </div>
            <FormItem>
              <FormLabel>Titulo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Titulo"
                  {...register("title")}
                />
              </FormControl>
              {errors.title && (
                <FormMessage>{errors.title.message}</FormMessage>
              )}
            </FormItem>

            <FormItem className="mt-2">
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input
                  placeholder="Descripción"
                  {...register("description")}
                />
              </FormControl>
              {errors.description && (
                <FormMessage>
                  {errors.description.message}
                </FormMessage>
              )}
            </FormItem>
          </form>
        </Form>

        <TextEditor
          updateDocumentContent={updateDocumentContent}
          content={document.content}
          documentVariables={documentVariables}
        />
      </div>
    </div>
  );
};

export default DocumentTemplateEditor;
