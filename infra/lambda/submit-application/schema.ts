import { z } from "zod";

/**
 * Server-side mirror of the frontend's application schema
 * (src/types/application.ts). Kept as a standalone copy rather than a
 * shared import so the frontend (Vite/browser) and this Lambda (Node,
 * separately deployed) stay independently buildable — duplication is
 * deliberate here, not accidental.
 */
const phoneDigits = (value: string) => value.replace(/\D/g, "");
const phoneField = () => z.string().refine((v) => phoneDigits(v).length === 10, "Invalid phone number.");
const optionalPhoneField = () =>
  z
    .string()
    .optional()
    .refine((v) => !v || phoneDigits(v).length === 10, "Invalid phone number.");

export const submitApplicationSchema = z.object({
  applicationType: z.enum(["apartment", "rent-to-own"]),
  propertyOfInterest: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().min(1),
  phone: phoneField(),
  email: z.string().email(),
  currentStreet: z.string().min(1),
  currentCity: z.string().min(1),
  currentState: z.string().min(2).max(2),
  currentZip: z.string().min(1),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/),
  driversLicenseNumber: z.string().optional(),
  driversLicenseState: z.string().optional(),
  employerName: z.string().min(1),
  jobTitle: z.string().min(1),
  employmentLength: z.string().min(1),
  monthlyIncome: z.coerce.number().positive(),
  employerPhone: optionalPhoneField(),
  additionalIncomeSource: z.string().optional(),
  additionalIncomeAmount: z.coerce.number().optional(),
  currentAddressDuration: z.string().min(1),
  residenceType: z.string().min(1),
  landlordName: z.string().optional(),
  landlordPhone: optionalPhoneField(),
  reasonForLeaving: z.string().optional(),
  everEvicted: z.enum(["Yes", "No"]),
  everConvicted: z.enum(["Yes", "No"]),
  occupants: z.array(
    z.object({ name: z.string().min(1), relationship: z.string().min(1), age: z.coerce.number() })
  ),
  pets: z.array(z.object({ type: z.string().min(1), breed: z.string().min(1), weight: z.string().optional() })),
  vehicles: z.array(
    z.object({
      make: z.string().min(1),
      model: z.string().min(1),
      year: z.string().optional(),
      licensePlate: z.string().optional(),
    })
  ),
  references: z
    .array(z.object({ name: z.string().min(1), relationship: z.string().min(1), phone: phoneField() }))
    .min(1),
  emergencyContactName: z.string().min(1),
  emergencyContactRelationship: z.string().min(1),
  emergencyContactPhone: phoneField(),
  desiredDownPayment: z.coerce.number().optional(),
  creditCheckConsent: z.boolean().optional(),
  estimatedCreditRange: z.string().optional(),
  certifyTrue: z.literal(true),
  authorizeBackgroundCheck: z.literal(true),
  consentBackgroundCheckSharing: z.literal(true),
  signatureFullName: z.string().min(1),
  documents: z.array(z.object({ key: z.string().min(1), filename: z.string().min(1) })).optional(),
});

export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;
