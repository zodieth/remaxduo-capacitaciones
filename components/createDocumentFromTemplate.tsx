"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import TextEditor from "@/components/TextEditor";
import {
  DocumentTemplate,
  DocumentVariable,
  Profile,
} from "@/types/next-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/ui/loadingOverlay";
import { NewProfileModal } from "./modals/NewProfileModal";

type Block = {
  id: number;
  content: string;
  variables: VariableForDocument[];
  profileId: string | null;
  isDuplicable: boolean;
  index: number;
  isOriginal: boolean;
};

type VariableForDocument = {
  id: string;
  name: string;
  variable: string;
  value: string;
};

const api = {
  async getDocumentTemplates() {
    const response = await fetch(
      "/api/documents/documentTemplate"
    );
    return response.json();
  },
  async getAuthorizationDocumentTemplates() {
    const response = await fetch(
      "/api/documents/documentTemplate/authTemplate"
    );
    return response.json();
  },
  async createDocumentFromTemplate(
    template: DocumentTemplate,
    blocks: Block[],
    propertyId: string | undefined
  ) {
    const response = await fetch("/api/documents/fromTemplate", {
      method: "POST",
      body: JSON.stringify({ template, blocks, propertyId }),
      headers: { "Content-Type": "application/json" },
    });
    return response;
  },
  async getProfiles({ propertyId }: { propertyId: string }) {
    const response = await fetch(`/api/profiles/${propertyId}`);
    return response.json();
  },
  async createProfile({
    name,
    propertyId,
  }: {
    name: string;
    propertyId: string;
  }) {
    const response = await fetch("/api/profiles", {
      method: "POST",
      body: JSON.stringify({ name, propertyId }),
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },
  async createProfileDocumentVariable({
    profileId,
    documentVariableId,
    value,
  }: {
    profileId: string;
    documentVariableId: string;
    value: string;
  }) {
    const response = await fetch(
      "/api/profileDocumentVariable",
      {
        method: "POST",
        body: JSON.stringify({
          profileId,
          documentVariableId,
          value,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.json();
  },
};

export const CreateDocumentFromTemplate = ({
  propertyId,
  isAuthDocument = false,
}: {
  propertyId?: string;
  isAuthDocument?: boolean;
}) => {
  const router = useRouter();
  const [documentTemplates, setDocumentTemplates] = useState<
    DocumentTemplate[]
  >([]);
  const [selectedDocumentTemplate, setSelectedDocumentTemplate] =
    useState<DocumentTemplate | null>(null);
  const [editorBlocks, setEditorBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchTemplates = isAuthDocument
      ? api.getAuthorizationDocumentTemplates
      : api.getDocumentTemplates;
    fetchTemplates().then(setDocumentTemplates);
    propertyId &&
      api
        .getProfiles({
          propertyId: propertyId || "",
        })
        .then(setProfiles);
  }, [isAuthDocument, propertyId]);

  const handleInputChange = (e: any) => {
    const selected =
      documentTemplates.find(
        template => template.id === e.target.value
      ) || null;
    setSelectedDocumentTemplate(selected);
    console.log("selected", selected);

    if (selected) {
      const contentArray = selected.templateBlocks.map(
        (block: any) => ({
          ...block,
          variables: block.variables.map(
            (variable: DocumentVariable) => ({
              id: variable.id,
              variable: `{${variable.name}}`,
              value: "",
            })
          ),
          isOriginal: true,
          profileId: null,
        })
      );
      console.log("contentArray", contentArray);
      setEditorBlocks(contentArray);
    }
  };

  const createProfile = async (newProfileName: string) => {
    if (newProfileName.trim() === "") return;
    const profile = await api.createProfile({
      name: newProfileName,
      propertyId: propertyId || "",
    });
    if (profile) toast.success("Perfil creado correctamente");
    setProfiles([...profiles, profile]);
  };

  console.log("editorBlocks", editorBlocks);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!selectedDocumentTemplate) {
        throw new Error("No se ha seleccionado una plantilla");
      }

      const profileDocumentVariablesPromises = editorBlocks
        .filter(block => block.profileId)
        .map(block =>
          block.variables.map(variable =>
            api.createProfileDocumentVariable({
              profileId: block.profileId || "",
              documentVariableId: variable.id,
              value: variable.value,
            })
          )
        );

      const profileDocumentVariablesResponse = await Promise.all(
        profileDocumentVariablesPromises
      );

      console.log(
        "profileDocumentVariablesResponse",
        profileDocumentVariablesResponse
      );

      console.log("editorBlocks", editorBlocks);
      const response = await api.createDocumentFromTemplate(
        selectedDocumentTemplate,
        editorBlocks,
        propertyId
      );
      if (response.ok) {
        toast.success("Documento creado correctamente");
        const redirectPath = isAuthDocument
          ? `/documentos`
          : `/documentos/${propertyId}`;
        router.push(redirectPath);
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error al crear el documento:", error);
      toast.error("Error al crear el documento");
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeVariable = (
    blockId: number,
    variableName: string,
    newValue: string
  ) => {
    const updatedBlocks = editorBlocks.map(block =>
      block.id === blockId
        ? {
            ...block,
            variables: block.variables.map(v =>
              v.variable === variableName
                ? { ...v, value: newValue }
                : v
            ),
          }
        : block
    );
    setEditorBlocks(updatedBlocks);
  };

  const updateBlockContent = (
    blockId: number,
    newContent: string
  ) => {
    const updatedBlocks = editorBlocks.map(block =>
      block.id === blockId
        ? { ...block, content: newContent }
        : block
    );
    setEditorBlocks(updatedBlocks);
  };

  const duplicateBlock = (blockId: number) => {
    setEditorBlocks(prev => {
      const blockIndex = prev.findIndex(
        block => block.id === blockId
      );
      if (blockIndex !== -1 && prev[blockIndex].isDuplicable) {
        const newBlock = {
          ...prev[blockIndex],
          id: Date.now(),
          index: prev[blockIndex].index + 1,
          isOriginal: false,
        };

        const updatedBlocks = prev.map((block, index) => {
          if (index > blockIndex) {
            return { ...block, index: block.index + 1 };
          }
          return block;
        });

        return [
          ...updatedBlocks.slice(0, blockIndex + 1),
          newBlock,
          ...updatedBlocks.slice(blockIndex + 1),
        ];
      }
      return prev;
    });
  };

  const removeBlock = (blockId: number) => {
    const updatedBlocks = editorBlocks
      .filter(block => block.id !== blockId)
      .map((block, index) => ({
        ...block,
        index: index + 1,
      }));
    setEditorBlocks(updatedBlocks);
  };

  const handleProfileChange = (
    blockId: number,
    profileId: string | null
  ) => {
    const updatedBlocks = editorBlocks.map(block => {
      if (block.id === blockId) {
        if (profileId === null) {
          const resetVariables = block.variables.map(
            variable => ({
              ...variable,
              value: "",
            })
          );
          return {
            ...block,
            profileId,
            variables: resetVariables,
          };
        } else {
          const selectedProfile = profiles.find(
            profile => profile.id === profileId
          );
          const updatedVariables = block.variables.map(
            variable => {
              const foundVariable =
                selectedProfile?.variables.find(
                  v => v.documentVariable.id === variable.id
                );
              return {
                ...variable,
                value: foundVariable ? foundVariable.value : "",
              };
            }
          );
          return {
            ...block,
            profileId,
            variables: updatedVariables,
          };
        }
      }
      return block;
    });
    setEditorBlocks(updatedBlocks);
  };

  return (
    <div className="m-4">
      <h1 className="font-bold text-2xl m-4">
        Crear documento desde plantilla
      </h1>
      <div className="flex items-center justify-between mb-4">
        <select
          onChange={handleInputChange}
          className="input border w-1/3 py-2 px-1 rounded-md m-3"
        >
          <option value="">Selecciona una plantilla</option>
          {documentTemplates.map(template => (
            <option key={template.id} value={template.id}>
              {template.title}
            </option>
          ))}
        </select>
        {selectedDocumentTemplate && (
          <NewProfileModal
            trigger={
              <Button variant="secondary">Añadir Perfil</Button>
            }
            onCreate={profileName => {
              createProfile(profileName);
            }}
          />
        )}
      </div>

      {selectedDocumentTemplate && (
        <form
          onSubmit={onSubmit}
          className="flex justify-end mb-4"
        >
          <Button type="submit">Crear Documento</Button>
        </form>
      )}

      {selectedDocumentTemplate &&
        editorBlocks
          .sort((a, b) => a.index - b.index)
          .map(block => (
            <div
              key={block.id}
              className="p-4 border mt-4 flex rounded-md"
            >
              <div className="w-1/4 pr-4">
                <label>Perfil:</label>
                <select
                  value={block.profileId || ""}
                  onChange={e =>
                    handleProfileChange(
                      block.id,
                      e.target.value || null
                    )
                  }
                  className="input border w-fit py-2 px-1 rounded-md ml-3"
                >
                  <option value="">SIN PERFIL</option>
                  {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>

                {block.variables.map((variable, varIndex) => (
                  <div key={varIndex} className="mt-2">
                    <label>{variable.variable}</label>
                    <Input
                      type="text"
                      value={variable.value}
                      onChange={(e: any) =>
                        onChangeVariable(
                          block.id,
                          variable.variable,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="w-3/4">
                <TextEditor
                  content={block.content}
                  documentVariables={block.variables}
                  updateDocumentContent={newContent =>
                    updateBlockContent(block.id, newContent)
                  }
                  hideControls={true}
                  disableEditing={true}
                />
              </div>
              <div className="flex flex-col mt-2 ml-2">
                {block.isDuplicable && (
                  <Button
                    onClick={() => duplicateBlock(block.id)}
                    className="mb-5"
                  >
                    Duplicar
                  </Button>
                )}
                {!block.isOriginal && (
                  <Button
                    variant="secondary"
                    onClick={() => removeBlock(block.id)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          ))}

      {isLoading && <LoadingOverlay />}
    </div>
  );
};
