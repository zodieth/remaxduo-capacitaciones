import React from "react";
import { CreateDocumentFromTemplate } from "@/components/createDocumentFromTemplate";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreateAuthorizationDocumentFromTemplate = () => {
  return (
    <div className="m-4">
      <Link href={`/documentos`}>
        <Button size="sm">
          <ArrowLeft />
          Volver a Propiedades
        </Button>
      </Link>
      <CreateDocumentFromTemplate isAuthDocument={true} />
    </div>
  );
};

export default CreateAuthorizationDocumentFromTemplate;
