"use client";

import React, { use, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
// import {
//   DocumentTemplate,
//   DocumentVariable,
// } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import TextEditor from "@/components/TextEditor";
import {
  DocumentTemplate,
  DocumentVariable,
} from "@/types/next-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoadingOverlay from "@/components/ui/loadingOverlay";

type VariableForDocument = {
  variable: string;
  value: string;
};

const formSchema = z.object({
  //   title: z.string().min(1, "Ingrese un título"),
  //   description: z.string().optional(),
});

const api = {
  async getDocumentTemplates() {
    const response = await fetch(
      "/api/documents/documentTemplate"
    );
    return response.json();
  },
  async createDocumentFromTemplate(
    template: DocumentTemplate,
    variables: VariableForDocument[],
    propertyId: string
  ) {
    console.log("Enviando al servidor:", {
      template,
      variables,
      propertyId,
    });

    const response = await fetch("/api/documents/fromTemplate", {
      method: "POST",
      body: JSON.stringify({
        template,
        variables,
        propertyId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  },
};

const CreateDocumentFromTemplatePage = ({
  params,
}: {
  params: { propertyId: string };
}) => {
  const router = useRouter();
  const propertyId = params.propertyId;
  const [documentTemplates, setDocumentTemplates] = useState<
    DocumentTemplate[]
  >([]);
  const [selectedDocumentTemplate, setSelectedDocumentTemplate] =
    useState<DocumentTemplate>();
  const [isLoading, setIsLoading] = useState(false);

  const [variables, setVariables] = useState<
    VariableForDocument[]
  >([]);

  useEffect(() => {
    api.getDocumentTemplates().then(documentTemplates => {
      setDocumentTemplates(documentTemplates);
    });
  }, []);

  const variablesForm = useForm({
    // resolver: zodResolver(formSchema),
  });

  const {
    register: registerVariables,
    handleSubmit,
    reset: resetVariables,
    watch: watchVariables,
    formState: { errors: errorsVariables },
  } = variablesForm;

  const selectForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentTemplate: "",
    },
  });

  const {
    register,
    reset,
    watch,
    formState: { errors },
  } = selectForm;

  const handleInputChange = (e: any) => {
    console.log(e.target.value);
    const selected = documentTemplates.find(
      documentTemplate => documentTemplate.id === e.target.value
    );
    setSelectedDocumentTemplate(selected);
  };

  const onChangeVariable = (
    variableName: string,
    newValue: string
  ) => {
    setVariables(prev => {
      // Encuentra el índice de la variable en el array, si existe
      const varIndex = prev.findIndex(
        v => v.variable === `{${variableName}}`
      );

      // Si la variable ya existe, actualiza su valor
      if (varIndex !== -1) {
        const newVariables = [...prev];
        newVariables[varIndex] = {
          ...newVariables[varIndex],
          value: newValue,
        };
        return newVariables;
      }

      // Si la variable no existe, la agrega al array
      return [
        ...prev,
        { variable: `{${variableName}}`, value: newValue },
      ];
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      if (!selectedDocumentTemplate) {
        throw new Error("No se ha seleccionado una plantilla");
      }

      const response = await api.createDocumentFromTemplate(
        selectedDocumentTemplate,
        variables,
        propertyId
      );
      if (response.ok) {
        setIsLoading(false);
        toast.success("Documento creado correctamente");
        await response.json();
        router.push(`/documentos/${propertyId}`);
      } else {
        toast.error("Error al crear el documento");
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error al crear el documento:", error);
      toast.error("Error al crear el documento");
    }
  };

  return (
    <div className="m-4">
      <Link href={`/documentos/${propertyId}`}>
        <Button size="sm">
          <ArrowLeft />
          Volver a propiedad
        </Button>
      </Link>
      <h1 className="font-bold text-2xl m-4">
        Crear documento desde plantilla
      </h1>

      <Form {...selectForm}>
        <form>
          <FormControl>
            <select
              id="documentTemplate"
              {...register("documentTemplate", {
                onChange: handleInputChange,
              })}
              value={selectedDocumentTemplate?.id}
              className="input border w-fit py-2 px-1 rounded-md m-3"
            >
              <option value="">Selecciona una plantilla</option>
              {documentTemplates.map(documentTemplate => (
                <option
                  key={documentTemplate.id}
                  value={documentTemplate.id}
                >
                  {documentTemplate.title}
                </option>
              ))}
            </select>
          </FormControl>
        </form>
      </Form>
      {selectedDocumentTemplate && (
        <div className="flex flew-row m-4">
          <div className="flex flex-col w-1/4 pr-3">
            <h3>Variables a reemplazar:</h3>
            {/* form de inputs para cada variable con su valor */}
            <Form {...variablesForm}>
              <form
                onSubmit={variablesForm.handleSubmit(onSubmit)}
              >
                {selectedDocumentTemplate?.variables.map(
                  (variable: DocumentVariable) => (
                    <FormItem key={variable.id} className="p-2">
                      <FormLabel>{`{${variable.name}}`}</FormLabel>
                      <FormControl>
                        <Input
                          id={variable.id}
                          placeholder={variable.name}
                          value={
                            variables.find(
                              v =>
                                v.variable ===
                                `{${variable.name}}`
                            )?.value
                          }
                          {...registerVariables(variable.name, {
                            onChange: e =>
                              onChangeVariable(
                                variable.name,
                                e.target.value
                              ),
                          })}
                        />
                      </FormControl>
                    </FormItem>
                  )
                )}
                <Button type="submit" className="mr-3">
                  Crear documento
                </Button>
              </form>
            </Form>
          </div>
          <div className="w-3/4">
            <div>
              <TextEditor
                content={selectedDocumentTemplate.content}
                documentVariables={
                  selectedDocumentTemplate.variables
                }
                updateDocumentContent={() => {
                  console.log("updateDocumentContent");
                }}
                hideControls={true}
                disableEditing={true}
              />
            </div>
          </div>
        </div>
      )}
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default CreateDocumentFromTemplatePage;
