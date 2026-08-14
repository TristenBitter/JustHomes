import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { randomUUID } from "crypto";
import { submitApplicationSchema } from "./schema";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESv2Client({});

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
  const applicationId = randomUUID();
  const submittedAt = new Date().toISOString();

  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        applicationId,
        applicationType: values.applicationType,
        propertyId: values.propertyId,
        submittedAt,
        values,
      },
    })
  );

  const addressSummary = `Property ID: ${values.propertyId}`;
  const label = applicationTypeLabel(values.applicationType);

  const adminEmail = ses.send(
    new SendEmailCommand({
      FromEmailAddress: FROM_EMAIL,
      Destination: { ToAddresses: [ADMIN_EMAIL] },
      Content: {
        Simple: {
          Subject: { Data: `New ${label} — ${values.firstName} ${values.lastName}` },
          Body: {
            Text: {
              Data: [
                `A new ${label.toLowerCase()} was submitted.`,
                "",
                addressSummary,
                `Applicant: ${values.firstName} ${values.lastName}`,
                `Phone: ${values.phone}`,
                `Email: ${values.email}`,
                `Monthly income: $${values.monthlyIncome}`,
                "",
                `Application ID: ${applicationId}`,
                `Submitted: ${submittedAt}`,
              ].join("\n"),
            },
          },
        },
      },
    })
  );

  const applicantEmail = ses.send(
    new SendEmailCommand({
      FromEmailAddress: FROM_EMAIL,
      Destination: { ToAddresses: [values.email] },
      Content: {
        Simple: {
          Subject: { Data: "We received your JustHomes application" },
          Body: {
            Text: {
              Data: [
                `Hi ${values.firstName},`,
                "",
                `Thanks for submitting your ${label.toLowerCase()} with JustHomes. We've received it and will be in touch soon.`,
                "",
                `Application ID: ${applicationId}`,
                `Submitted: ${submittedAt}`,
                "",
                "If you have questions in the meantime, just reply to this email.",
              ].join("\n"),
            },
          },
        },
      },
    })
  );

  try {
    await Promise.all([adminEmail, applicantEmail]);
  } catch (error) {
    // The application is already saved — email delivery failing shouldn't fail the submission.
    console.error("Failed to send one or more confirmation emails", error);
  }

  return jsonResponse(201, { applicationId, submittedAt });
};
