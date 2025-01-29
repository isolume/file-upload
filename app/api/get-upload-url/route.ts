import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3Client, BUCKET_NAME } from "@/lib/s3.mjs";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { filename, fileType, fileSize, expirationHours } = await request.json();

    if (!filename || !fileType || !fileSize || !expirationHours) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (fileSize > 5 * 1024 * 1024 * 1024 || expirationHours < 1 || expirationHours > 24 * 7) {
      return Response.json({ error: "Invalid file size or expiration time" }, { status: 400 });
    }

    const fileExtension = filename.split(".").pop() || "";
    const randomFileName = crypto.randomBytes(3).toString("hex") + "." + fileExtension;

    const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: BUCKET_NAME,
        Key: randomFileName,
        Conditions: [
            ["content-length-range", 0, 5242880000],
            { "Content-Type": fileType }
        ],
        Expires: 3600,
        Fields: {
            "Content-Type": fileType
        }
    })

    return Response.json({
      url,
      fields,
      fileName: randomFileName,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return Response.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
} 