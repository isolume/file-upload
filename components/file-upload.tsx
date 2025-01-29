"use client"

import { useState } from "react"
import { createFileRecord } from "@/app/upload-action"
import { useDropzone } from "react-dropzone"
import { Upload, ClipboardCopy, Hourglass, XCircle } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export default function FileUpload() {
    const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string; url?: string } | null>(null)
    const [expirationTime, setExpirationTime] = useState("1")

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        try {
            setUploadStatus({ success: false, message: "アップロード中" })

            // Get presigned URL
            const presignedResponse = await fetch('/api/get-upload-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    expirationHours: parseInt(expirationTime)
                })
            })

            const { url, fields, fileName } = await presignedResponse.json()

            // Create form data with required fields
            const formData = new FormData()
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string)
            })
            formData.append('file', file)

            // Upload to S3
            const uploadResponse = await fetch(url, {
                method: 'POST',
                body: formData
            })

            if (!uploadResponse.ok) {
                throw new Error('Upload failed')
            }

            // Create database record
            const result = await createFileRecord(fileName, parseInt(expirationTime))
            setUploadStatus(result)
        } catch (error) {
            console.error("Upload error:", error)
            setUploadStatus({ success: false, message: "ファイルアップロードに失敗しました" })
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const handleCopyToClipboard = (url: string | undefined) => {
        if (!url) return

        navigator.clipboard.writeText(url)
    }

    return (
        <div className="w-full max-w-md">
      <div
        {...getRootProps()}
        className={`p-8 border-4 px-24 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? "border-white bg-blue-500" : "border-blue-300 bg-blue-100"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-blue-500" />
        <p className="mt-2 text-sm text-blue-700">
          {isDragActive ? "ここにファイルをドロップ" : "ファイルをアップロード"}
        </p>
      </div>
      <div className="mt-4">
        <Select onValueChange={setExpirationTime} defaultValue={expirationTime}>
          <SelectTrigger className="w-full bg-white bg-opacity-20 backdrop-blur-sm border-blue-300 text-blue-900">
            <SelectValue placeholder="Select expiration time" />
          </SelectTrigger>
          <SelectContent className="bg-white bg-opacity-20 backdrop-blur-sm border-blue-300">
            <SelectItem value="1" className="text-blue-900">
              1時間
            </SelectItem>
            <SelectItem value="12" className="text-blue-900">
              12時間
            </SelectItem>
            <SelectItem value="24" className="text-blue-900">
              1日間
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {uploadStatus && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            uploadStatus.message === "アップロード中"
              ? "bg-orange-100 text-orange-700"
              : uploadStatus.success
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
          }`}
        >
          {uploadStatus.message === "アップロード中" ? (
            <>
              <Hourglass className="inline-block mr-2" />
              {uploadStatus.message}
            </>
          ) : uploadStatus.success ? (
            <>
              {uploadStatus.url && (
                <>
                  <ClipboardCopy className="inline-block mr-2" />
                  <a
                    onClick={() => handleCopyToClipboard(uploadStatus.url)}
                    className="cursor-pointer border-2 border-dotted border-green-700 rounded-md p-1.5 bg-white bg-opacity-20 backdrop-blur-sm"
                  >
                    {uploadStatus.url}
                  </a>
                </>
              )}
            </>
          ) : (
            <>
              <XCircle className="inline-block mr-2" />
              {uploadStatus.message}
            </>
          )}
        </div>
      )}
    </div>
    )
}