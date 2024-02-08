"use client";

import { useState } from "react";

export function FileUpload() {
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
        name="file"
        onChange={(e) => setFile(e.target.files?.[0])}
      />
      <input type="submit" value="Upload" />
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
