export const CONFIG = {
  providers: {
    storage: {
      provider: "MINIO",
      endpoint: process.env.NEXT_PUBLIC_STORAGE_ENDPOINT,
      region: process.env.NEXT_PUBLIC_STORAGE_REGION,
      bucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
      path: process.env.NEXT_PUBLIC_STORAGE_PATH,
      accessKeyId: process.env.NEXT_PUBLIC_STORAGE_ACCESS_KEY_ID,
      secretAccessKey:
        process.env.NEXT_PUBLIC_STORAGE_SECRET_ACCESS_KEY,
      signatureVersion: "v4",
    },
  },
};
