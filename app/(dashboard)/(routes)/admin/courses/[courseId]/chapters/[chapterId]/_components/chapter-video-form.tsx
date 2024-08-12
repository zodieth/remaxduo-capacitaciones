"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { VideoPlayer } from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/video-player";
import { SingleImageDropzone } from "@/components/SingleImageDropzone";
import { submitFormAction } from "@/actions/upload-files";
import ProgressBar from "@/components/ProgressBar";

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
      setIsLoading(false);
      toggleEdit();
      setFile(undefined);
      router.refresh();
    } catch {
      toast.error("Algo no funcionó correctamente");
    }
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
          <Button
            className="mt-4 mb-4"
            onClick={async () => {
              if (file) {
                const formData = new FormData();
                formData.append("file", file);

                setIsLoading(true);
                const response = await submitFormAction(
                  null,
                  formData
                );

                if (response.url) {
                  onSubmit({ videoUrl: response.url });
                }
              }
            }}
          >
            Subir Video
          </Button>
          {isLoading && (
            // center items
            <div className="mt-4 flex flex-col items-center justify-center">
              {/* <Loader2 className="h-14 w-14 animate-spin" /> */}
              <div>Cargando video, por favor espera...</div>
              <ProgressBar />
            </div>
          )}

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
