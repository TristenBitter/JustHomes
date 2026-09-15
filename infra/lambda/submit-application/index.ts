import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import { randomUUID } from "crypto";
import * as nodemailer from "nodemailer";
import { submitApplicationSchema } from "./schema";
import { generateApplicationPdf } from "./generatePdf";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESClient({});

const TABLE_NAME = process.env.TABLE_NAME!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const FROM_EMAIL = process.env.FROM_EMAIL!;

function jsonResponse(statusCode: number, body: unknown) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

function applicationTypeLabel(type: string) {
  return type === "apartment" ? "Apartment Rental Application" : "Rent-to-Own Application";
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  let payload: unknown;
  try {
    payload = JSON.parse(event.body ?? "{}");
  } catch {
    return jsonResponse(400, { message: "Invalid JSON body." });
  }

  const parsed = submitApplicationSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(400, { message: "Validation failed.", issues: parsed.error.issues });
  }

  const values = parsed.data;

  if (values.applicationType === "rent-to-own" && (!values.documents || values.documents.length === 0)) {
    return jsonResponse(400, {
      message: "A state-issued photo ID upload is required for rent-to-own applications.",
    });
  }
  const applicationId = randomUUID();
  const submittedAt = new Date().toISOString();

  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        applicationId,
        applicationType: values.applicationType,
        submittedAt,
        values,
      },
    })
  );

  const label = applicationTypeLabel(values.applicationType);

  try {
    const pdfBuffer = await generateApplicationPdf(values, applicationId, submittedAt);

    const mail = await nodemailer.createTransport({ streamTransport: true, buffer: true }).sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New ${label} — ${values.firstName} ${values.lastName}`,
      text: [
        `A new ${label.toLowerCase()} was submitted.`,
        "",
        values.propertyOfInterest ? `Property of interest: ${values.propertyOfInterest}` : "",
        `Applicant: ${values.firstName} ${values.lastName}`,
        `Phone: ${values.phone}`,
        `Email: ${values.email}`,
        `Monthly income: $${values.monthlyIncome}`,
        "",
        `Application ID: ${applicationId}`,
        `Submitted: ${submittedAt}`,
        "",
        "The full application is attached as a PDF.",
      ].join("\n"),
      attachments: [
        {
          filename: `justhomes-application-${applicationId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    await ses.send(new SendRawEmailCommand({ RawMessage: { Data: mail.message as Buffer } }));
  } catch (error) {
    // The application is already saved — email delivery failing shouldn't fail the submission.
    console.error("Failed to generate or send the application PDF email", error);
  }

  return jsonResponse(201, { applicationId, submittedAt });
};
