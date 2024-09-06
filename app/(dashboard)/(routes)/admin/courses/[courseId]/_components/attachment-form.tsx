"use client";

import * as z from "zod";
import axios from "axios";
import {
  PlusCircle,
  File as FileIcon,
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  FileState,
  MultiFileDropzone,
} from "@/components/MultiFileDropzone";
import { uploadMultipleFilesAction } from "@/actions/upload-multiple-files";
import { sanitizeFileName } from "@/helpers/name-cleaner";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );
  const [files, setFiles] = useState<FileState[]>();
  const [isLoading, setIsLoading] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/attachments`,
        values
      );

      toast.success("Archivos subidos con éxito");
      toggleEdit();
      setFiles(undefined);
      router.refresh();
    } catch {
      toast.error("Algo no funcionó correctamente");
    }
    setIsLoading(false);
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/attachments/${id}`
      );
      toast.success("Archivo eliminado");
      router.refresh();
    } catch {
      toast.error("Algo no funcionó correctamente");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Archivos del curso
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancelar</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar un archivo
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No hay archivos aún
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map(attachment => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <FileIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">
                    {sanitizeFileName(attachment.name)}
                  </p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          {/* <FileUpload
            onChange={({ url, name }) => {
              if (url && name) {
                onSubmit({ url: url, name: name });
              }
            }}
          /> */}
          <MultiFileDropzone
            value={files}
            onChange={files => {
              setFiles(files);
            }}
          />

          <div className="mt-4">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando
              </Button>
            ) : (
              <Button
                className="mt-4"
                onClick={async () => {
                  setIsLoading(true);
                  if (files) {
                    const formData = new FormData();
                    files.forEach(fileState => {
                      if (fileState.file) {
                        // Modificar el nombre del archivo antes de agregarlo al FormData
                        const modifiedFileName = `${courseId}/${fileState.file.name}`;

                        // Crear un nuevo archivo con el nombre modificado
                        const renamedFile = new File(
                          [fileState.file],
                          modifiedFileName,
                          {
                            type: fileState.file.type,
                          }
                        );

                        formData.append("files", renamedFile);
                      }
                    });

                    console.log("Files to upload:", formData);

                    try {
                      const response =
                        await uploadMultipleFilesAction(
                          formData
                        );

                      response.forEach(fileResult => {
                        let path = fileResult.url
                          .split("/")
                          .pop();

                        if (path) {
                          path = path.replace(/%20/g, " ");
                          path = path.replace(/%28/g, "(");
                          path = path.replace(/%29/g, ")");
                          path = path.replace(/%5B/g, "[");
                          path = path.replace(/%5D/g, "]");

                          onSubmit({
                            url: fileResult.url,
                            name: path,
                          });
                        }
                      });
                    } catch (error) {
                      toast.error("Error al subir los archivos");
                      console.error("Upload error:", error);
                    }
                  }
                }}
                disabled={
                  !files || files.length === 0 || isLoading
                }
              >
                Subir Archivos
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground mt-4">
            Agrega lo que tus estudiantes necesiten para el
            curso.
          </div>
        </div>
      )}
    </div>
  );
};
