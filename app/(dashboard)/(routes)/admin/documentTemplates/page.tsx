import React, { useEffect, useState } from "react";
import { DocumentTemplate } from "@prisma/client";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { db } from "@/lib/db";

const api = {
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    const response = await fetch(
      "/api/documents/documentTemplate"
    );
    return response.json();
  },
};

const TemplatesPage = async () => {
  const documentTemplates = await db.documentTemplate.findMany();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          Plantillas de documentos
        </h1>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={documentTemplates} />
      </div>
    </div>
  );
};

export default TemplatesPage;
