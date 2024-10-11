"use client";

import React, { useEffect, useState } from "react";
import TextEditor from "@/components/TextEditor";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ConfirmChangesModal } from "@/components/modals/confirm-changes-modal";
import { DocumentStatus } from "@prisma/client";
import { DocumentFromTemplate } from "@/types/next-auth";
import { Alert } from "@/components/ui/alert";
import DialogWithTextarea from "@/components/ui/dialog-with-textarea";

const api = {
  async getDocument(documentId: string) {
    const response = await fetch(`/api/documents/${documentId}`);
    return response.json();
  },
  async updateDocument({
    documentId,
    status,
    rejectedReason,
  }: {
    documentId: string;
    status: DocumentStatus;
    rejectedReason: string;
  }) {
    const response = await fetch(
      `/api/documents/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          rejectedReason,
        }),
      }
    );
    return response;
  },
};

const DocumentViewRequest = ({
  params,
}: {
  params: { documentId: string; propertyId: string };
}) => {
  const documentId = params.documentId;

  const router = useRouter();
  const [document, setDocument] =
    useState<DocumentFromTemplate>();
  const [originalContent, setOriginalContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getDocument(documentId).then(document => {
      setDocument(document);
      setOriginalContent(document.content);
    });

    setIsLoading(false);
  }, [documentId]);

  const onSubmit = async (
    selectedStatus: DocumentStatus,
    rejectedReason: string = ""
  ) => {
    setIsLoading(true);

    try {
      const res = await api.updateDocument({
        documentId,
        status: selectedStatus,
        rejectedReason,
      });

      console.log("res", res);
      toast.success("Permiso del documento actualizado");
      router.push("/admin/editRequests");
    } catch (error) {
      toast.error(
        "Error al actualizar el permiso del documento"
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="m-4">
      <Link href={"/admin/editRequests"}>
        <Button size="sm">
          <ArrowLeft />
          Volver a Solicitudes
        </Button>
      </Link>
      <div className="flex justify-between pr-10">
        <h1 className="font-bold text-2xl m-5">
          Solicitud de edición del documento:
        </h1>
      </div>
      <h2 className="m-7">{document?.documentName}</h2>

      <div
        className="
          flex
          flex-col
          bg-gray-100
          p-4 rounded-md m-7"
      >
        <h3 className="font-bold mb-4">
          Mensaje de la Solicitud:
        </h3>
        <span>{document?.whyIsEditting}</span>
      </div>

      <div>
        <div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <div className="flex justify-start ml-7 gap-5">
                <DialogWithTextarea
                  onSubmit={value =>
                    onSubmit(DocumentStatus.REJECTED, value)
                  }
                  title="Por favor, indique por qué está rechazando este documento"
                  description="Por favor, complete el siguiente campo. Es obligatorio para continuar."
                  submitText="Rechazar solicitud"
                  cancelText="Cancelar"
                >
                  <Button variant="secondary">Rechazar</Button>
                </DialogWithTextarea>

                <ConfirmChangesModal
                  onConfirm={() =>
                    onSubmit(DocumentStatus.APPROVED)
                  }
                  title="Desea aprobar la solicitud?"
                  description={
                    "Al aprobar la solicitud, se habilitará la descarga del documento"
                  }
                  confirmText="Aprobar solicitud"
                  cancelText="Cancelar"
                >
                  <Button variant={"default"}>Aprobar</Button>
                </ConfirmChangesModal>
              </div>

              <TextEditor
                content={originalContent}
                documentVariables={[]}
                updateDocumentContent={() =>
                  console.log("No se puede editar")
                }
                hideControls={true}
                isEditable={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewRequest;
