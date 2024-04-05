"use client";

import { useState } from "react";
import DocumentTemplateEditor from "../_components/DocumentTemplateEditor";
import LoadingOverlay from "@/components/ui/loadingOverlay";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export type DocumentToSend = {
  title: string;
  description?: string;
  content: string;
  variablesIds: string[];
};

const CreateDocumentTemplatePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onCreate = async (documentToSend: DocumentToSend) => {
    try {
      const res = await fetch(
        "/api/documents/documentTemplate",
        {
          method: "POST",
          body: JSON.stringify(documentToSend),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        toast.success("Plantilla creada con éxito");
        router.push("/admin/documentTemplates");
      } else {
        // Si el servidor responde con un código de error
        toast.error("Error al crear la plantilla");
        console.error("Error status:", res.status);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Error al crear la plantilla");
      console.error(
        "Error submitting document template:",
        error
      );
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <LoadingOverlay />}
      <DocumentTemplateEditor onCreate={onCreate} />;
    </>
  );
};

export default CreateDocumentTemplatePage;
