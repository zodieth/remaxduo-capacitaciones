"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { DocumentVariable } from "@/types/next-auth";
import { DocumentVariableSelect } from "./DocumentVariableSelect";

const TextEditor = ({
  documentVariables,
  updateDocumentContent,
  content,
  hideControls,
  disableEditing,
  createDocumentVariable,
}: {
  documentVariables: DocumentVariable[];
  updateDocumentContent: (html: string) => void;
  content?: string;
  hideControls?: boolean;
  disableEditing?: boolean;
  createDocumentVariable: (
    data: Omit<
      DocumentVariable,
      "id" | "createdAt" | "updatedAt"
    >
  ) => Promise<void>;
}) => {
  const [selectedVariable, setSelectedVariable] =
    useState<DocumentVariable | null>(null);

  const documentContent =
    content ||
    "<p>Comienze a escribir su documento aqui...</p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p>";

  // ---------- EDITOR SETUP ----------

  const editor = useEditor({
    extensions: [StarterKit],
    content: documentContent,
    editable: disableEditing ? false : true,

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      updateDocumentContent(html);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  // Comprueba si el estado actual es negrita o cursiva y aplica clases condicionales
  const boldIsActive = editor?.isActive("bold");
  const italicIsActive = editor?.isActive("italic");

  const insertVariable = () => {
    if (selectedVariable) {
      editor
        .chain()
        .focus()
        .insertContent(selectedVariable.value)
        .run();
    }
  };

  // ---------- END EDITOR SETUP ----------

  return (
    <div className="w-[100%]">
      <div className="mt-10 w-[100%] border border-gray-300 rounded-lg p-3">
        {!hideControls && (
          <div className="flex justify-between items-center">
            <div>
              <Button
                onClick={() =>
                  editor.chain().focus().toggleBold().run()
                }
                // className={`${editor.isActive("italic") ? "is-active" : ""} m-2`}
                className={`m-2 ${boldIsActive ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              >
                Negrita
              </Button>
              <Button
                onClick={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={`m-2 ${italicIsActive ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              >
                Cursiva
              </Button>
            </div>
            <div className="flex justify-between items-center w-1/2">
              {documentVariables.length > 0 && (
                <>
                  <DocumentVariableSelect
                    documentVariables={documentVariables}
                    selectedDocumentVariable={selectedVariable}
                    setSelectedDocumentVariable={variable =>
                      setSelectedVariable(variable)
                    }
                    createDocumentVariable={async data => {
                      await createDocumentVariable(data);
                    }}
                  />
                </>
              )}
              <Button onClick={insertVariable} className="m-2">
                Insertar Variable
              </Button>
            </div>
          </div>
        )}
        <EditorContent
          className="mt-10 border border-gray-300 rounded-lg"
          editor={editor}
        />
      </div>
    </div>
  );
};

export default TextEditor;
