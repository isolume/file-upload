"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function createFileRecord(
  fileName: string,
  expirationHours: number
) {
  try {
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + expirationHours)

    await prisma.file.create({
      data: {
        name: fileName,
        hash: fileName.split(".")[0],
        uploadTime: new Date(),
        expirationDate: expirationDate,
      },
    })

    return {
      success: true,
      message: "ファイルがアップロードされました",
      url: `https://umi.to/${fileName}`,
    }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, message: "ファイルアップロードに失敗しました" }
  }
}
