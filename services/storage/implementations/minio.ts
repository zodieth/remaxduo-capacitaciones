import S3 from "aws-sdk/clients/s3";

import { IStorageProvider } from "../interface";
import { CONFIG } from "../../storage/config";
import { convertFileToBuffer } from "../../../helpers/convert-file-to-buffer";

export class MinioStorageProvider implements IStorageProvider {
  client: S3;

  constructor() {
    this.client = new S3({
      endpoint: CONFIG.providers.storage.endpoint,
      apiVersion: "latest",
      region: CONFIG.providers.storage.region,
      accessKeyId: CONFIG.providers.storage.accessKeyId,
      secretAccessKey: CONFIG.providers.storage.secretAccessKey,
      signatureVersion:
        CONFIG.providers.storage.signatureVersion,
      s3ForcePathStyle: true,
    });
  }

  async upload(file: File): Promise<string> {
    const fileBuffer = await convertFileToBuffer(file);

    console.log("Uploading file:", file.name);
    console.log("Endpoint: ", CONFIG.providers.storage.endpoint);

    const params = {
      Bucket: CONFIG.providers.storage.bucket as string,
      Key: file.name,
      Body: fileBuffer,
      ACL: "public-read",
    };

    try {
      const { Location } = await this.client
        .upload(params)
        .promise();
      console.log("File uploaded successfully:", Location);
      return Location;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Error uploading file");
    }
  }

  async delete(path: string): Promise<void> {
    const params = {
      Bucket: CONFIG.providers.storage.bucket as string,
      Key: path,
    };

    try {
      await this.client.deleteObject(params).promise();
    } catch (error) {
      console.error("Delete error:", error);
      throw new Error("Error deleting file");
    }
  }
}
