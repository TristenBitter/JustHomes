import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.TABLE_NAME!;

function jsonResponse(statusCode: number, body: unknown) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const result = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
  const items = (result.Items ?? [])
    .map((item) => ({
      applicationId: item.applicationId,
      applicationType: item.applicationType,
      propertyId: item.propertyId,
      submittedAt: item.submittedAt,
      applicantName: `${item.values?.firstName ?? ""} ${item.values?.lastName ?? ""}`.trim(),
      applicantEmail: item.values?.email,
    }))
    .sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)));

  return jsonResponse(200, { items });
};
