"use client";

import React, { useEffect, useState } from "react";
import TextEditor from "@/components/TextEditor";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import PdfGenerator from "../_components/pdf-generator";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ConfirmChangesModal } from "@/components/modals/confirm-changes-modal";
import { DocumentFromTemplate } from "@/types/next-auth";
import { Alert } from "@/components/ui/alert";
import DialogWithTextarea from "@/components/ui/dialog-with-textarea";
import { DocumentStatus } from "@prisma/client";

const api = {
  async getDocument(documentId: string) {
    const response = await fetch(`/api/documents/${documentId}`);
    return response.json();
  },
  async updateDocument({
    documentId,
    content,
    status,
    whyIsEditting,
  }: {
    documentId: string;
    content: string;
    status: DocumentStatus;
    whyIsEditting: string;
  }) {
    console.log("content", content);

    const response = await fetch(
      `/api/documents/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, status, whyIsEditting }),
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
  const [whyIsEditting, setWhyIsEditting] = useState("");
  const [rejectedReason, setRejectedReason] = useState("");
  const [isEditActive, setIsEditActive] = useState(false);
  const [isDownloadable, setIsDownloadable] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getDocument(documentId).then(document => {
      setDocumentFromTemplate(document);
      setOriginalContent(document.content);
      setActualContent(document.content);
      setRejectedReason(document.rejectedReason);
      setIsDownloadable(
        document.status === DocumentStatus.APPROVED
      );
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

  const onSubmit = async (value: string) => {
    setIsLoading(true);
    console.log("value", value);

    if (actualContent === originalContent) {
      setIsEditActive(false);
      setWhyIsEditting("");
      setIsLoading(false);
      toast.error(
        "No se han encontrado cambios para enviar a revisión"
      );
      return;
    } else {
      setWhyIsEditting(value);
      setIsDownloadable(false);
    }

    try {
      const res = await api.updateDocument({
        documentId,
        content: actualContent,
        status: DocumentStatus.PENDING,
        whyIsEditting: value,
      });

      const updatedDocument = await res.json();

      setDocumentFromTemplate(prevDocument => {
        if (!prevDocument) {
          return prevDocument;
        }

        return {
          ...prevDocument,
          status: updatedDocument.status,
        };
      });

      toast.success("Documento enviado a revisión");
    } catch (error) {
      toast.error("Error al solicitar revisión");
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
      <div className="m-5">
        {isEditActive && (
          <Alert variant="warning">
            <p>Modo edición activo</p>
          </Alert>
        )}
      </div>

      <div>
        <div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <div className="flex justify-end mr-7">
                {!isDownloadable && (
                  <>
                    <p className="text-red-500 mr-10">
                      {documentFromTemplate?.status ===
                        DocumentStatus.REJECTED &&
                        "Este documento ha sido rechazado. Prueba a editarlo de nuevo y enviarlo a revisión"}
                    </p>

                    <p className="text-yellow-500 mr-10">
                      {documentFromTemplate?.status ===
                        DocumentStatus.PENDING &&
                        "Este documento está pendiente de revisión"}
                    </p>

                    <p className="text-gray-500 mr-10">
                      {documentFromTemplate?.status ===
                        DocumentStatus.DRAFT &&
                        "Este documento está en modo borrador. Para poder descargarlo, debe editarlo y enviarlo a revisión"}
                    </p>
                  </>
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
                      <ConfirmChangesModal
                        onConfirm={() => {
                          setActualContent(originalContent);
                          setIsEditActive(false);
                        }}
                        title={"Desea cancelar los cambios?"}
                        description={
                          "Al cancelar los cambios, se perderán los cambios realizados"
                        }
                        confirmText="Descartar cambios"
                        cancelText="Continuar editando"
                      >
                        <Button variant={"secondary"}>
                          Cancelar
                        </Button>
                      </ConfirmChangesModal>
                      <DialogWithTextarea
                        onSubmit={onSubmit}
                        title="Por favor, indique por qué está editando este documento"
                        description="Por favor, complete el siguiente campo. Es obligatorio para continuar."
                        submitText="Enviar a revisión"
                        cancelText="Cancelar"
                      >
                        <Button>Guardar cambios</Button>
                      </DialogWithTextarea>
                      {/* <ConfirmChangesModal
                        onConfirm={() => onSubmit()}
                        title={"Desea Guardar los cambios?"}
                        description={
                          "Al guardar los cambios, el documento se enviará a revisión"
                        }
                        confirmText="Guardar cambios"
                        cancelText="Cancelar"
                      >
                        <Button>Guardar cambios</Button>
                      </ConfirmChangesModal> */}
                    </div>
                  )}
                </div>

                <PdfGenerator
                  disabled={!isDownloadable || isEditActive}
                  content={originalContent}
                  title={documentFromTemplate?.title}
                />
              </div>
              {documentFromTemplate?.status ===
                DocumentStatus.REJECTED && (
                <div className="flex flex-col bg-gray-100 p-4 rounded-md m-7">
                  <h3 className="font-bold mb-4">
                    Motivo de rechazo:
                  </h3>
                  <span>{rejectedReason}</span>
                </div>
              )}
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
