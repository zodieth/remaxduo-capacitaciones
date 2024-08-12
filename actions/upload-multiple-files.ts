import { MinioStorageProvider } from "@/services/storage/implementations/minio";

export async function uploadMultipleFilesAction(
  formData: FormData
) {
  const storageProvider = new MinioStorageProvider();

  // Array para almacenar las URLs de los archivos subidos
  const fileUploadResults: { name: string; url: string }[] = [];

  // Convertir entries a un array para iterar
  const formDataEntries = Array.from(formData.entries());

  // Recorrer los archivos en el FormData
  for (const [key, value] of formDataEntries) {
    if (value instanceof File) {
      const url = await storageProvider.upload(value);
      fileUploadResults.push({
        name: value.name,
        url,
      });
    }
  }

  return fileUploadResults; // Devolver las URLs de los archivos subidos
}
