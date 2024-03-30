"use client";

import React from "react";
// lib1:
import DocViewer, {
  DocViewerRenderers,
} from "@cyntler/react-doc-viewer";
import { FileUpload } from "@/components/file-upload";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Template1 } from "./../../../../../public/TemplateDocs/Template1.docx";
// import doc file template
// const Template1 = require("./../../../../../public/TemplateDocs/Template1.docx");

// lib2:
// import DocViewer from "react-doc-viewer";

type FormValues = {
  title: string;
  url: string;
  description: string;
  variables: string[];
};

const formSchema = z.object({
  title: z.string().min(1, "Ingrese un título"),
  description: z.string().optional(),
  url: z.string().url("Ingrese una URL válida"),
  variables: z.array(z.string()).optional(),
});

const TemplatesPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
    },
  });
  const description = watch("description");
  const title = watch("title");

  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    // Limpia y prepara las variables para el almacenamiento
    const cleanedVariables = values?.variables?.map(
      variable => variable.replace(/[{} ]/g, "") // Elimina corchetes y espacios
    );

    // Stringifica el arreglo de variables
    const variablesString = JSON.stringify(cleanedVariables);

    console.log("values", values);
    console.log("cleanedVariables", cleanedVariables);
    const res = await fetch("/api/documents", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        variables: variablesString, // Envía las variables como un string JSON
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log("Data", data);
  };

  return (
    <div className="p-6">
      <h1>Templates</h1>
      <div className="mt-10 space-y-4 w-[75%] border border-gray-300 rounded-lg p-6 md:w-1/2">
        {/* form for titulo y descripcion del documento */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
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

            <FormItem>
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

        {/* file uploader */}
        <FileUpload
          endpoint="templateDocs"
          accept=".docx"
          onChange={({ url, name, variables }) => {
            if (url && name) {
              onSubmit({
                url: url,
                title: title,
                variables: variables,
                description: description,
              });
            }
          }}
        />
      </div>
    </div>
  );

  //lib1:
  //   const docs = [
  //     // { uri: "https://url-to-my-pdf.pdf" }, // Remote file
  //     {
  //       uri: require("public/TemplateDocs/Template1.docx"),
  //       fileType: "docx",
  //       fileName: "Template1.docx",
  //     },
  //     // {
  //     //   uri: Template1,
  //     //   fileType: "docx",
  //     //   fileName: "Template1.docx",
  //     // },
  //     // { uri: require("/TemplateDocs/Template2.docx") }, // Local File
  //   ];
  //   return (
  //     <DocViewer
  //       documents={docs}
  //       pluginRenderers={DocViewerRenderers}
  //     />
  //   );
  //   lib2:
  //   const docs = [
  //     // { uri: "https://url-to-my-pdf.pdf" },
  //     { uri: require("public/TemplateDocs/Template1.docx") }, // Local File
  //   ];
  //   return <DocViewer documents={docs} />;
};

export default TemplatesPage;
