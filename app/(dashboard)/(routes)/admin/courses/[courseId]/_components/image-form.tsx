"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { SingleImageDropzone } from "@/components/SingleImageDropzone";
import { submitFormAction } from "@/actions/upload-files";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "La imagen es requerida",
  }),
});

export const ImageForm = ({
  initialData,
  courseId,
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File>();

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Curso actualizado");
      setFile(undefined);
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Algo no funcionó correctamente");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Imagen del curso
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancelar</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar una imagen
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editar imagen
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData?.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <SingleImageDropzone
            width={200}
            height={200}
            value={file}
            onChange={file => {
              console.log(file);
              setFile(file);
            }}
          />
          <Button
            className="mt-4"
            onClick={async () => {
              if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await submitFormAction(
                  null,
                  formData
                );

                if (response.url) {
                  onSubmit({ imageUrl: response.url });
                }
              }
            }}
          >
            Subir Imagen
          </Button>

          <div className="text-xs text-muted-foreground mt-4">
            Recomencación de 16:9 aspect ratio
          </div>
        </div>
      )}
    </div>
  );
};
