"use client";

import * as z from "zod";
import axios from "axios";
import {
  Loader2,
  Pencil,
  PlusCircle,
  Video,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/video-player";
import { SingleImageDropzone } from "@/components/SingleImageDropzone";
import { submitFormAction } from "@/actions/upload-files";

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Capítulo actualizado");
      toggleEdit();
      setFile(undefined);
      router.refresh();
    } catch {
      toast.error("Algo no funcionó correctamente");
    }
    setIsLoading(false);
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video del capítulo
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar un video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editar video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <VideoPlayer
              isLocked={false}
              completeOnEnd={false}
              courseId={courseId}
              chapterId={chapterId}
              title={initialData.title}
              url={initialData.videoUrl}
              startPlaying={false}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          {/* <FileUpload
            onChange={({ url }) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }} */}
          {/* este es para imagenes nomas */}
          <SingleImageDropzone
            width={500}
            height={200}
            value={file}
            onChange={file => {
              console.log(file);
              setFile(file);
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
                className="mt-4 mb-4"
                onClick={async () => {
                  if (file) {
                    setIsLoading(true);
                    const formData = new FormData();

                    // Modificar el nombre del archivo antes de añadirlo
                    const modifiedFileName = `${courseId}/${chapterId}/${file.name}`;

                    // Crear un nuevo archivo con el nombre modificado
                    const renamedFile = new File(
                      [file],
                      modifiedFileName,
                      {
                        type: file.type,
                      }
                    );

                    formData.append("file", renamedFile);

                    const response = await submitFormAction(
                      null,
                      formData
                    );

                    if (response.url) {
                      onSubmit({ videoUrl: response.url });
                    }
                  }
                }}
                disabled={!file || isLoading}
              >
                Subir Video
              </Button>
            )}
          </div>

          {/* <div className="text-xs text-muted-foreground mt-4">
            Subir video
          </div> */}
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Los videos pueden tomar unos minutos en proesar.
          Refresca la página si el video no aparece.
        </div>
      )}
    </div>
  );
};
