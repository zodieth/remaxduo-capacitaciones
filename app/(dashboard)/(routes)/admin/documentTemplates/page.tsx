import React from "react";
import { DocumentTemplate } from "@prisma/client";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { db } from "@/lib/db";

const TemplatesPage = async () => {
  const documentTemplates: DocumentTemplate[] =
    await db.documentTemplate.findMany();

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
