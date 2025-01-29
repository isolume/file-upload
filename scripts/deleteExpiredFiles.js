import { PrismaClient } from '@prisma/client';
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../lib/s3.mjs";

export async function deleteExpiredFiles() {
  const prisma = new PrismaClient();
  
  try {
    const now = new Date();
    const expiredFiles = await prisma.file.findMany({
      where: {
        expirationDate: {
          lte: now,
        },
      },
    });

    for (const file of expiredFiles) {
      try {
        // Use the stored file path or name as the S3 key
        const s3Key = file.path || file.name;
        
        await s3Client.send(new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
        }));
        
        await prisma.file.delete({
          where: {
            id: file.id,
          },
        });
      } catch (err) {
        console.error(`Error deleting file ${file.name} (id: ${file.id}):`, err);
        // Continue with next file even if one fails
      }
    }
  } catch (error) {
    console.error('Error in deleteExpiredFiles:', error);
    throw error;
  } finally {
    // Ensure database connection is always closed
    await prisma.$disconnect();
  }
}