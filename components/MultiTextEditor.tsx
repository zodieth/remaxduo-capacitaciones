import React, { useState } from "react";
import TextEditor from "./TextEditor";
import { DocumentVariable } from "@/types/next-auth";
import { Button } from "./ui/button";
import { Combobox } from "./ui/combobox";

export type Editor = {
  id: string;
  index: number;
  content: string;
  isDuplicable: boolean;
};

const MultiTextEditor = ({
  documentVariables,
  updateDocumentContent,
  initialContent,
}: {
  documentVariables: DocumentVariable[];
  updateDocumentContent: (editors: Editor[]) => void;
  initialContent: Editor[];
}) => {
  const [editors, setEditors] =
    useState<Editor[]>(initialContent);

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
    const newId = Math.random().toString(36).substr(2, 9);
    const newIndex = editors.length + 1; // Índice es un número
    setEditors([
      ...editors,
      {
        id: newId,
        index: newIndex,
        isDuplicable: false,
        content: "<p>Nuevo Bloque</p>",
      },
    ]);
  };

  const removeEditor = (id: string) => {
    const updatedEditors = editors
      .filter(editor => editor.id !== id)
      .map((editor, index) => ({
        ...editor,
        index: index + 1, // Reasignar índices como números
      }));

    setEditors(updatedEditors);
    updateDocumentContent(updatedEditors);
  };

  const toggleDuplicable = (id: string) => {
    const updatedEditors = editors.map(editor =>
      editor.id === id
        ? { ...editor, isDuplicable: !editor.isDuplicable }
        : editor
    );
    setEditors(updatedEditors);
    updateDocumentContent(updatedEditors);
  };

  return (
    <div>
      {editors
        .sort((a, b) => a.index - b.index)
        .map(editor => (
          <div key={editor.id}>
            <TextEditor
              documentVariables={documentVariables}
              updateDocumentContent={html =>
                updateMultiDocumentContent({
                  id: editor.id,
                  html,
                })
              }
              content={editor.content}
              hideControls={false}
              disableEditing={false}
            />
            <div className="flex items-center space-x-4 mt-2 ml-10">
              <label className="flex items-center mr-2">
                <input
                  type="checkbox"
                  checked={editor.isDuplicable}
                  onChange={() => toggleDuplicable(editor.id)}
                  className="mr-2"
                />
                Duplicable
              </label>

              <Button
                variant="outline"
                className="mt-2"
                onClick={() => removeEditor(editor.id)}
              >
                Eliminar este Bloque
              </Button>
            </div>
          </div>
        ))}
      <Button className="mt-5" onClick={addEditor}>
        Agregar Bloque
      </Button>
    </div>
  );
};

export default MultiTextEditor;
