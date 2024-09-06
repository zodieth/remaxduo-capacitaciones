"use client";
// file: components/file-upload.tsx
import { useState } from "react";
import { Button } from "./ui/button";
import LoadingSpinner from "./ui/loadingSpinner";
import { submitFormAction } from "../actions/upload-files";

export function FileUpload({
  onChange,
  accept = "*",
}: {
  onChange: ({
    url,
    name,
  }: {
    url: string;
    name?: string;
  }) => void;
  accept?: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (files.length === 0) return;
    setIsLoading(true);

    const data = new FormData();
    files.forEach(file => {
      data.append("file", file);
    });

    try {
      // Llamada a la acción de submit
      const result = await submitFormAction({}, data);

      // Llamar a onChange con la nueva URL
      if (result.url) {
        onChange({ url: result.url, name: files[0].name });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="file"
          id="fileInput"
          name="files"
          multiple
          className="hidden"
          onChange={e =>
            setFiles(
              e.target.files ? Array.from(e.target.files) : []
            )
          }
          accept={accept}
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Seleccionar archivo
        </label>
        <Button
          type="submit"
          className={`ml-5 mt-4 py-2 px-4 font-bold rounded ${
            files.length === 0
              ? "bg-gray-500 text-gray-100 cursor-not-allowed"
              : ""
          }`}
          disabled={files.length === 0}
        >
          Subir archivo
        </Button>
      </form>
      {isLoading && (
        <div className="mt-4">
          <LoadingSpinner />
          <p>Subiendo archivo...</p>
        </div>
      )}
      {!isLoading && files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">
            Archivo seleccionado:
          </h3>
          <ul>
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center p-2 bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
              >
                <p className="text-xs line-clamp-1">
                  {file.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
