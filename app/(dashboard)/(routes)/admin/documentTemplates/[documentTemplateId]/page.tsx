"use client";

import LoadingOverlay from "@/components/ui/loadingOverlay";
import DocumentTemplateEditor from "../_components/DocumentTemplateEditor";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { DocumentToSend } from "../create/page";
import { DocumentVariable } from "@prisma/client";

const api = {
  async getDocumentTemplate(documentTemplateId: string) {
    const response = await fetch(
      `/api/documents/documentTemplate/${documentTemplateId}`
    );
    return response.json();
  },
  async editDocumentTemplate(
    documentTemplateId: string,
    documentToSend: DocumentToSend
  ) {
    const response = await fetch(
      `/api/documents/documentTemplate/${documentTemplateId}`,
      {
        method: "PUT",
        body: JSON.stringify(documentToSend),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  },
};

const EditDocumentTemplatePage = ({
  params,
}: {
  params: { documentTemplateId: string };
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [document, setDocument] = useState<DocumentToSend>();

  useEffect(() => {
    api
      .getDocumentTemplate(params.documentTemplateId)
      .then(document => {
        let documentToSend: DocumentToSend = {
          title: document.title,
          description: document.description,
          content: document.content,
          variablesIds: document.variables.map(
            (variable: DocumentVariable) => variable.id
          ),
        };
        setDocument(documentToSend);
      });
  }, [params.documentTemplateId]);

  const onEdit = async (documentToSend: DocumentToSend) => {
    setIsLoading(true);
    try {
      const res = await api.editDocumentTemplate(
        params.documentTemplateId,
        documentToSend
      );

      if (res.ok) {
        const data = await res.json();
        toast.success("Plantilla editada con éxito");
        console.log("Data received:", data);
        router.push("/admin/documentTemplates");
      } else {
        toast.error("Error al editar la plantilla");
        console.error("Error status:", res.status);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Error al editar la plantilla");
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
      {document && (
        <DocumentTemplateEditor
          onEdit={onEdit}
          documentTemplateState={document}
        />
      )}
    </>
  );
};

export default EditDocumentTemplatePage;
