"use client";

import React, { useEffect, useState } from "react";
import TextEditor from "@/components/TextEditor";
import { DocumentFromTemplate } from "@/types/next-auth";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import PdfGenerator from "../_components/pdf-generator";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ConfirmChangesModal } from "@/components/modals/confirm-changes-modal";

const api = {
  async getDocument(documentId: string) {
    const response = await fetch(`/api/documents/${documentId}`);
    return response.json();
  },
  async updateDocument({
    documentId,
    content,
    approved,
  }: {
    documentId: string;
    content: string;
    approved: boolean;
  }) {
    console.log("content", content);

    const response = await fetch(
      `/api/documents/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, approved }),
      }
    );
    return response;
  },

  async deleteDocument(documentId: string) {
    const response = await fetch(
      `/api/documents/${documentId}`,
      {
        method: "DELETE",
      }
    );
    return response;
  },
};

const DocumentFromTemplatePage = ({
  params,
}: {
  params: { documentId: string; propertyId: string };
}) => {
  const documentId = params.documentId;
  const propertyId = params.propertyId;
  const router = useRouter();
  const [documentFromTemplate, setDocumentFromTemplate] =
    useState<DocumentFromTemplate>();

  const [originalContent, setOriginalContent] = useState("");
  const [actualContent, setActualContent] = useState("");
  const [isEditActive, setIsEditActive] = useState(false);
  const [isDownloadable, setIsDownloadable] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getDocument(documentId).then(document => {
      setDocumentFromTemplate(document);
      setOriginalContent(document.content);
      setActualContent(document.content);
      setIsDownloadable(document.approved);
    });

    setIsLoading(false);
  }, [documentId]);

  const onDelete = async (documentId: string) => {
    setIsLoading(true);
    try {
      await api.deleteDocument(documentId);
      toast.success("Documento eliminado");
      router.push(`/documentos/${propertyId}`);
    } catch (error) {
      toast.error("Error al eliminar el documento");
    }
    setIsLoading(false);
  };

  const onSubmit = async () => {
    setIsLoading(true);

    if (actualContent === originalContent) {
      setIsEditActive(false);
      setIsLoading(false);
      return;
    } else {
      setIsDownloadable(false);
    }

    try {
      const res = await api.updateDocument({
        documentId,
        content: actualContent,
        approved: false,
      });

      console.log("res", res);
      toast.success("Documento actualizado");
    } catch (error) {
      toast.error("Error al actualizar el documento");
    }
    setIsEditActive(false);
    setIsLoading(false);
  };

  return (
    <div className="m-4">
      <Link href={`/documentos/${propertyId}`}>
        <Button size="sm">
          <ArrowLeft />
          Volver a propiedad
        </Button>
      </Link>
      <div className="flex justify-between pr-10">
        <h1 className="font-bold text-2xl m-5">
          Visualizar documento
        </h1>

        <ConfirmModal onConfirm={() => onDelete(documentId)}>
          <Button size="sm" disabled={isLoading}>
            <Trash className="h-4 w-4" />
          </Button>
        </ConfirmModal>
      </div>
      <h2 className="m-7">
        {documentFromTemplate?.documentName}
      </h2>

      <div>
        <div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <div className="flex justify-end mr-7">
                {!isDownloadable && (
                  <p className="text-red-500 mr-10">
                    Este documento aún no ha sido aprobado
                  </p>
                )}
                <div className="mr-5">
                  {!isEditActive && (
                    <Button
                      onClick={() => setIsEditActive(true)}
                    >
                      Editar documento
                    </Button>
                  )}
                  {isEditActive && (
                    <div className="flex space-x-2 justify-end">
                      <Button
                        onClick={() => {
                          setActualContent(originalContent);
                          setIsEditActive(false);
                        }}
                        variant={"secondary"}
                      >
                        Cancelar
                      </Button>
                      <ConfirmChangesModal
                        onConfirm={() => onSubmit()}
                      >
                        <Button>Guardar cambios</Button>
                      </ConfirmChangesModal>
                    </div>
                  )}
                </div>
                <PdfGenerator
                  disabled={!isDownloadable || isEditActive}
                  content={originalContent}
                  title={documentFromTemplate?.title}
                />
              </div>
              {isEditActive ? (
                <TextEditor
                  content={actualContent}
                  documentVariables={[]}
                  updateDocumentContent={(newContent: string) =>
                    setActualContent(newContent)
                  }
                  hideControls={true}
                  isEditable={true}
                />
              ) : (
                <TextEditor
                  content={actualContent}
                  documentVariables={[]}
                  updateDocumentContent={() =>
                    console.log("No se puede editar")
                  }
                  hideControls={true}
                  isEditable={false}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentFromTemplatePage;
