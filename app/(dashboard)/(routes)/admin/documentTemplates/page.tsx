"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DocumentTemplate } from "@prisma/client";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loadingSpinner";

const api = {
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    const response = await fetch(
      "/api/documents/documentTemplate"
    );
    return response.json();
  },
};

const TemplatesPage = () => {
  const [documentTemplates, setDocumentTemplates] = useState<
    DocumentTemplate[]
  >([]);

  useEffect(() => {
    api.getDocumentTemplates().then(templates => {
      console.log("Templates", templates);
      setDocumentTemplates(templates);
    });
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          Plantillas de documentos
        </h1>
        <Link href="/admin/documentTemplates/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nueva Plantilla
          </Button>
        </Link>
      </div>
      <div className="mt-6">
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              {documentTemplates.length === 0 ? (
                <LoadingSpinner />
              ) : (
                <ul className="min-w-full divide-y divide-gray-200 border border-gray-100">
                  {documentTemplates.map((template, index) => (
                    <li
                      key={template.id}
                      className="bg-white even:bg-gray-50"
                    >
                      <div className="px-6 py-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {template.title}
                        </span>
                        <div>
                          <Button
                            className=" px-2 py-1 mr-2"
                            onClick={() =>
                              console.log("Utilizar template")
                            }
                          >
                            Utilizar
                          </Button>
                          <Link
                            href={`/admin/documentTemplates/${template.id}`}
                          >
                            <Button
                              className=" px-2 py-1"
                              onClick={() =>
                                console.log("Edit template")
                              }
                            >
                              Editar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
