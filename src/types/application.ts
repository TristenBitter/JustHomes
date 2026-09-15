import { z } from "zod";

export type ApplicationType = "apartment" | "rent-to-own";

const phoneDigits = (value: string) => value.replace(/\D/g, "");

function phoneField(label: string) {
  return z
    .string()
    .min(1, `${label} is required.`)
    .refine((value) => phoneDigits(value).length === 10, `Enter a valid 10-digit ${label.toLowerCase()}.`);
}

function optionalPhoneField() {
  return z
    .string()
    .optional()
    .refine((value) => !value || phoneDigits(value).length === 10, "Enter a valid 10-digit phone number.");
}

const zipRegex = /^\d{5}(-\d{4})?$/;
const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;

function isRealCalendarDate(isoDate: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return false;
  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export const employmentLengthOptions = [
  "Less than 6 months",
  "6 months - 1 year",
  "1 - 2 years",
  "2 - 5 years",
  "5+ years",
] as const;

export const residenceTypeOptions = ["Rent", "Own", "Living with family", "Other"] as const;

export const purchaseTimelineOptions = [
  "Immediately",
  "1 - 3 months",
  "3 - 6 months",
  "6 - 12 months",
  "12+ months",
] as const;

export const propertyStepSchema = z.object({
  propertyOfInterest: z.string().optional(),
});

export const applicantInfoStepSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine(isRealCalendarDate, "Enter a valid date of birth."),
  phone: phoneField("Primary phone"),
  email: z.string().min(1, "Email address is required.").email("Enter a valid email address."),
  currentStreet: z.string().min(1, "Street address is required."),
  currentCity: z.string().min(1, "City is required."),
  currentState: z.string().min(2, "State is required.").max(2, "Use the 2-letter state code."),
  currentZip: z.string().min(1, "ZIP code is required.").regex(zipRegex, "Enter a valid ZIP code."),
  ssn: z
    .string()
    .min(1, "Social Security number is required.")
    .regex(ssnRegex, "Enter a valid SSN as 000-00-0000."),
  driversLicenseNumber: z.string().optional(),
  driversLicenseState: z.string().optional(),
});

export const employmentStepSchema = z.object({
  employerName: z.string().min(1, "Employer name is required."),
  jobTitle: z.string().min(1, "Job title is required."),
  employmentLength: z.enum(employmentLengthOptions, {
    message: "Select how long you've worked there.",
  }),
  monthlyIncome: z.coerce.number({ message: "Enter your gross monthly income." }).positive("Enter a valid amount."),
  employerPhone: optionalPhoneField(),
  additionalIncomeSource: z.string().optional(),
  additionalIncomeAmount: z.coerce.number().nonnegative().optional().or(z.literal(undefined)),
});

export const residenceHistoryStepSchema = z.object({
  currentAddressDuration: z.enum(employmentLengthOptions, {
    message: "Select how long you've lived at your current address.",
  }),
  residenceType: z.enum(residenceTypeOptions, { message: "Select an option." }),
  landlordName: z.string().optional(),
  landlordPhone: optionalPhoneField(),
  reasonForLeaving: z.string().optional(),
});

export const occupantSchema = z.object({
  name: z.string().min(1, "Name is required."),
  relationship: z.string().min(1, "Relationship is required."),
  age: z.coerce.number().int("Enter a whole number.").min(0, "Enter a valid age.").max(120, "Enter a valid age."),
});

export const petSchema = z.object({
  type: z.string().min(1, "Pet type is required."),
  breed: z.string().min(1, "Breed is required."),
  weight: z.string().optional(),
});

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required."),
  model: z.string().min(1, "Model is required."),
  year: z.string().optional(),
  licensePlate: z.string().optional(),
});

export const householdStepSchema = z.object({
  occupants: z.array(occupantSchema),
  otherAdultApplicants: z.string().optional(),
  pets: z.array(petSchema),
  vehicles: z.array(vehicleSchema),
});

export const referenceSchema = z.object({
  name: z.string().min(1, "Name is required."),
  relationship: z.string().min(1, "Relationship is required."),
  phone: phoneField("Phone number"),
});

export const referencesStepSchema = z.object({
  references: z.array(referenceSchema).min(1, "Add at least one reference."),
  emergencyContactName: z.string().min(1, "Emergency contact name is required."),
  emergencyContactRelationship: z.string().min(1, "Relationship is required."),
  emergencyContactPhone: phoneField("Emergency contact phone"),
});

export const purchaseDetailsStepSchema = z.object({
  desiredDownPayment: z.coerce.number({ message: "Enter your estimated down payment." }).positive("Enter a valid amount."),
  purchaseTimeline: z.enum(purchaseTimelineOptions, { message: "Select a timeline." }),
  creditCheckConsent: z.literal(true, { message: "Consent is required to proceed." }),
  estimatedCreditRange: z.string().optional(),
});

export const reviewStepSchema = z.object({
  certifyTrue: z.literal(true, { message: "You must certify the information is accurate." }),
  authorizeBackgroundCheck: z.literal(true, { message: "Authorization is required to proceed." }),
  consentBackgroundCheckSharing: z.literal(true, { message: "Consent is required to proceed." }),
  signatureFullName: z.string().min(1, "Type your full legal name to sign."),
});

export const apartmentApplicationSchema = propertyStepSchema
  .merge(applicantInfoStepSchema)
  .merge(employmentStepSchema)
  .merge(residenceHistoryStepSchema)
  .merge(householdStepSchema)
  .merge(referencesStepSchema)
  .merge(reviewStepSchema);

export const rentToOwnApplicationSchema = apartmentApplicationSchema.merge(purchaseDetailsStepSchema);

export type ApartmentApplicationValues = z.infer<typeof apartmentApplicationSchema>;
export type RentToOwnApplicationValues = z.infer<typeof rentToOwnApplicationSchema>;
export type ApplicationFormValues = ApartmentApplicationValues & Partial<RentToOwnApplicationValues>;

export interface SubmittedApplication {
  id: string;
  applicationType: ApplicationType;
  submittedAt: string;
  values: ApplicationFormValues;
}
