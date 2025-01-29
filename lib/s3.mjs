import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.WASABI_REGION,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY || "",
  },
  endpoint: process.env.WASABI_ENDPOINT,
});

export const BUCKET_NAME = process.env.WASABI_BUCKET_NAME || "";