import { apiPost } from "./api";

export interface UploadedDocument {
  key: string;
  filename: string;
}

interface CreateUploadUrlResponse {
  uploadUrl: string;
  key: string;
  filename: string;
}

export async function uploadDocument(file: File): Promise<UploadedDocument> {
  const { uploadUrl, key, filename } = await apiPost<CreateUploadUrlResponse>("/uploads", {
    filename: file.name,
    contentType: file.type,
  });

  const putResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!putResponse.ok) {
    throw new Error("Upload failed. Please try again.");
  }

  return { key, filename };
}
