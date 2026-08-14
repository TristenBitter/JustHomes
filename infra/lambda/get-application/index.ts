import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});
const TABLE_NAME = process.env.TABLE_NAME!;
const BUCKET_NAME = process.env.BUCKET_NAME!;

function jsonResponse(statusCode: number, body: unknown) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    return jsonResponse(400, { message: "Missing application id." });
  }

  const result = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { applicationId: id } }));
  if (!result.Item) {
    return jsonResponse(404, { message: "Application not found." });
  }

  const documents: Array<{ key: string; filename: string }> = result.Item.values?.documents ?? [];
  const documentLinks = await Promise.all(
    documents.map(async (doc) => ({
      filename: doc.filename,
      url: await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET_NAME, Key: doc.key }), { expiresIn: 300 }),
    }))
  );

  return jsonResponse(200, { ...result.Item, documentLinks });
};
