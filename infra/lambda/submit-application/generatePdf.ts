import PDFDocument from "pdfkit";
import type { SubmitApplicationInput } from "./schema";

function heading(doc: PDFKit.PDFDocument, text: string): void {
  doc.moveDown(1).fontSize(13).font("Helvetica-Bold").fillColor("#1f2933").text(text);
  doc.moveDown(0.3).fontSize(10).font("Helvetica").fillColor("#1f2933");
  doc
    .moveTo(doc.x, doc.y)
    .lineTo(545, doc.y)
    .strokeColor("#e4e1d9")
    .stroke();
  doc.moveDown(0.4);
}

function field(doc: PDFKit.PDFDocument, label: string, value: string | number | null | undefined): void {
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(`${label}: `, { continued: true })
    .font("Helvetica")
    .text(value === undefined || value === null || value === "" ? "—" : String(value));
}

function formatDateOfBirth(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${month}/${day}/${year}`;
}

export function generateApplicationPdf(
  input: SubmitApplicationInput,
  applicationId: string,
  submittedAt: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "LETTER" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const label = input.applicationType === "apartment" ? "Apartment Rental Application" : "Rent-to-Own Application";

    doc.fontSize(18).font("Helvetica-Bold").fillColor("#1f2933").text("JustHomes", { continued: false });
    doc.fontSize(13).font("Helvetica").fillColor("#af4a22").text(label);
    doc.fontSize(9).fillColor("#667085").text(`Application ID: ${applicationId}`);
    doc.text(`Submitted: ${new Date(submittedAt).toLocaleString("en-US")}`);

    if (input.propertyOfInterest) {
      heading(doc, "Property");
      field(doc, "Property of interest", input.propertyOfInterest);
    }

    heading(doc, "Applicant");
    field(doc, "Name", `${input.firstName} ${input.lastName}`);
    field(doc, "Date of birth", formatDateOfBirth(input.dateOfBirth));
    field(doc, "Social Security Number", input.ssn);
    field(doc, "Primary Phone", input.phone);
    field(doc, "Email Address", input.email);
    field(doc, "Current address", `${input.currentStreet}, ${input.currentCity}, ${input.currentState} ${input.currentZip}`);
    if (input.driversLicenseNumber) {
      field(doc, "Driver's license", `${input.driversLicenseNumber} (${input.driversLicenseState ?? "—"})`);
    }

    heading(doc, "Employment & Income");
    field(doc, "Employer", input.employerName);
    field(doc, "Job title", input.jobTitle);
    field(doc, "Length of employment", input.employmentLength);
    field(doc, "Employer phone", input.employerPhone);
    field(doc, "Gross monthly income", `$${input.monthlyIncome}`);
    if (input.additionalIncomeSource) {
      field(doc, "Additional income", `${input.additionalIncomeSource} — $${input.additionalIncomeAmount ?? 0}`);
    }

    heading(doc, "Residence History");
    field(doc, "Time at current address", input.currentAddressDuration);
    field(doc, "Residence type", input.residenceType);
    field(doc, "Landlord", `${input.landlordName ?? "—"} (${input.landlordPhone ?? "—"})`);
    field(doc, "Reason for leaving", input.reasonForLeaving);

    heading(doc, "Background Questions");
    field(doc, "Ever evicted from an apartment or residence?", input.everEvicted);
    field(doc, "Ever convicted of a crime?", input.everConvicted);

    heading(doc, "Intended Occupants");
    if (input.occupants.length === 0) {
      doc.font("Helvetica").fontSize(10).text("None listed.");
    } else {
      input.occupants.forEach((occupant) => {
        doc.font("Helvetica").fontSize(10).text(`- ${occupant.name} — ${occupant.relationship}, age ${occupant.age}`);
      });
    }

    heading(doc, "Pets");
    if (input.pets.length === 0) {
      doc.font("Helvetica").fontSize(10).text("None.");
    } else {
      input.pets.forEach((pet) => {
        doc.font("Helvetica").fontSize(10).text(`- ${pet.type}, ${pet.breed}${pet.weight ? `, ${pet.weight} lbs` : ""}`);
      });
    }

    heading(doc, "Vehicles");
    if (input.vehicles.length === 0) {
      doc.font("Helvetica").fontSize(10).text("None.");
    } else {
      input.vehicles.forEach((vehicle) => {
        doc
          .font("Helvetica")
          .fontSize(10)
          .text(`- ${vehicle.year ?? ""} ${vehicle.make} ${vehicle.model}${vehicle.licensePlate ? ` — Plate ${vehicle.licensePlate}` : ""}`);
      });
    }

    heading(doc, "References");
    input.references.forEach((reference) => {
      doc.font("Helvetica").fontSize(10).text(`- ${reference.name} (${reference.relationship}) — ${reference.phone}`);
    });
    field(doc, "Emergency contact", `${input.emergencyContactName} (${input.emergencyContactRelationship}) — ${input.emergencyContactPhone}`);

    if (input.applicationType === "rent-to-own") {
      heading(doc, "Purchase Details");
      field(doc, "Desired down payment", `$${input.desiredDownPayment ?? 0}`);
      field(doc, "Estimated credit range", input.estimatedCreditRange);
    }

    heading(doc, "Certifications");
    field(doc, "Certified information accurate", "Yes");
    field(doc, "Authorized background check", "Yes");
    field(doc, "Consented to background-check info sharing", "Yes");
    field(doc, "Signature", input.signatureFullName);

    if (input.documents && input.documents.length > 0) {
      heading(doc, "Attached Documents");
      input.documents.forEach((document) => {
        doc.font("Helvetica").fontSize(10).text(`- ${document.filename}`);
      });
    }

    doc.end();
  });
}
