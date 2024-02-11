"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export function FileUpload({
  endpoint,
  onChange,
}: {
  endpoint: string;
  onChange: (url: string) => void;
}) {
  const [file, setFile] = useState<File>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/fileUpload", {
        method: "POST",
        body: data,
      });
      // handle the error
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="file"
        id="fileInput"
        name="file"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      />
      <label htmlFor="fileInput" className="button">
        Subir Archivo Personalizado
      </label>
      <Button type="submit">Subir archivo</Button>
    </form>
  );
}

// return (
//   <UploadDropzone
//     endpoint={endpoint}
//     onClientUploadComplete={(res) => {
//       onChange(res?.[0].url);
//     }}
//     onUploadError={(error: Error) => {
//       toast.error(error.message);
//     }
