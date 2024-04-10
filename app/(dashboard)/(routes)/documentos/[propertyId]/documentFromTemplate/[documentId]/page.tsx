"use client";

import React, { useEffect, useState } from "react";
import TextEditor from "@/components/TextEditor";
import { DocumentFromTemplate } from "@/types/next-auth";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const api = {
  async getDocument(documentId: string) {
    const response = await fetch(`/api/documents/${documentId}`);
    return response.json();
  },
};

const DocumentFromTemplatePage = ({
  params,
}: {
  params: { documentId: string; propertyId: string };
}) => {
  const documentId = params.documentId;
  const propertyId = params.propertyId;

  const [documentFromTemplate, setDocumentFromTemplate] =
    useState<DocumentFromTemplate>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.getDocument(documentId).then(document => {
      setDocumentFromTemplate(document);
    });

    setIsLoading(false);
  }, [documentId]);

  return (
    <div className="m-2">
      <Link href={`/documentos/${propertyId}`}>
        <Button size="sm">
          <ArrowLeft />
          Volver a propiedad
        </Button>
      </Link>
      <h1 className="font-bold text-2xl m-3">
        Visualizar documento
      </h1>

      <div className="flex flew-row m-4">
        <div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              {documentFromTemplate && (
                <TextEditor
                  content={documentFromTemplate.content}
                  documentVariables={[]}
                  updateDocumentContent={() => {
                    console.log("updateDocumentContent");
                  }}
                  hideControls={true}
                  disableEditing={true}
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
