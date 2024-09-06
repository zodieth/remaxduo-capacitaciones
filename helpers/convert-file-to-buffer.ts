export async function convertFileToBuffer(file: File) {
  const reader = file.stream().getReader();
  let chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(Buffer.from(value)); // Convertir cada Uint8Array a Buffer
  }

  return Buffer.concat(chunks);
}
