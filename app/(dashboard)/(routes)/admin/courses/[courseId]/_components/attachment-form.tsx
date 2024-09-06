"use client";

import * as z from "zod";
import axios from "axios";
import {
  Pencil,
  PlusCircle,
  ImageIcon,
  File,
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import {
  FileState,
  MultiFileDropzone,
} from "@/components/MultiFileDropzone";
import { submitFormAction } from "@/actions/upload-files";
import { uploadMultipleFilesAction } from "@/actions/upload-multiple-files";

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
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">
                    {attachment.name}
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
          <Button
            className="mt-4"
            onClick={async () => {
              if (files) {
                const formData = new FormData();
                files.forEach(fileState => {
                  if (fileState.file) {
                    formData.append("files", fileState.file);
                  }
                });

                try {
                  const response =
                    await uploadMultipleFilesAction(formData);

                  response.forEach(fileResult => {
                    let path = fileResult.url.split("/").pop();

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
          >
            Subir Archivos
          </Button>
          <div className="text-xs text-muted-foreground mt-4">
            Agrega lo que tus estudiantes necesiten para el
            curso.
          </div>
        </div>
      )}
    </div>
  );
};
