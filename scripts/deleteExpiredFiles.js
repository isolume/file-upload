import { PrismaClient } from "@prisma/client"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { s3Client, BUCKET_NAME } from "../lib/s3.mjs"

export async function deleteExpiredFiles() {
  const prisma = new PrismaClient()

  try {
    const now = new Date()
    const expiredFiles = await prisma.file.findMany({
      where: {
        expirationDate: {
          lte: now,
        },
      },
    })

    for (const file of expiredFiles) {
      try {
        const s3Key = file.name

        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
          })
        )

        await prisma.file.delete({
          where: {
            id: file.id,
          },
        })
      } catch (err) {
        console.error(`Error deleting file ${file.name} (id: ${file.id}):`, err)
      }
    }
  } catch (error) {
    console.error("Error in deleteExpiredFiles:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}
