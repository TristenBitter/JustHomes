import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3 = new S3Client({});
const BUCKET_NAME = process.env.BUCKET_NAME!;

const ALLOWED_CONTENT_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

function jsonResponse(statusCode: number, body: unknown) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  let payload: { filename?: string; contentType?: string };
  try {
    payload = JSON.parse(event.body ?? "{}");
  } catch {
    return jsonResponse(400, { message: "Invalid JSON body." });
  }

  const { filename, contentType } = payload;
  if (!filename || !contentType) {
    return jsonResponse(400, { message: "filename and contentType are required." });
  }
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return jsonResponse(400, { message: "Unsupported file type. Allowed: PDF, JPEG, PNG." });
  }

  const documentId = randomUUID();
  const key = `uploads/${documentId}/${filename}`;

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key, ContentType: contentType }),
    { expiresIn: 300 }
  );

  return jsonResponse(200, { uploadUrl, key, filename });
};
