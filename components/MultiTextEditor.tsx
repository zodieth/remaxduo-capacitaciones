import React, { useState } from "react";
import TextEditor from "./TextEditor";
import { DocumentVariable } from "@/types/next-auth";
import { Button } from "./ui/button";

const MultiTextEditor = ({
  documentVariables,
  updateDocumentContent,
  initialContent,
}: {
  documentVariables: DocumentVariable[];
  updateDocumentContent: (
    editors: { id: string; content: string }[]
  ) => void;
  initialContent: { id: string; content: string }[];
}) => {
  const [editors, setEditors] =
    useState<{ id: string; content: string }[]>(initialContent);

  const updateMultiDocumentContent = ({
    id,
    html,
  }: {
    id: string;
    html: string;
  }) => {
    const updatedEditors = editors.map(editor =>
      editor.id === id ? { ...editor, content: html } : editor
    );
    setEditors(updatedEditors);
    updateDocumentContent(updatedEditors);
  };

  const addEditor = () => {
    // const newId = editors.length + 1;
    // create new id string
    const newId = Math.random().toString(36).substr(2, 9);
    setEditors([
      ...editors,
      { id: newId, content: "<p>Nuevo Editor</p>" },
    ]);
  };

  const removeEditor = (id: string) => {
    const updatedEditors = editors.filter(
      editor => editor.id !== id
    );
    setEditors(updatedEditors);
    updateDocumentContent(updatedEditors); // Actualizar el contenido después de eliminar un editor
  };

  console.log("editors: ", editors);

  return (
    <div>
      <Button className="mt-5" onClick={addEditor}>
        Agregar Bloque
      </Button>
      {editors.map(editor => (
        <div key={editor.id}>
          <TextEditor
            documentVariables={documentVariables}
            updateDocumentContent={html =>
              updateMultiDocumentContent({ id: editor.id, html })
            }
            content={editor.content}
            hideControls={false}
            disableEditing={false}
          />
          <Button onClick={() => removeEditor(editor.id)}>
            Eliminar este Bloque
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MultiTextEditor;
