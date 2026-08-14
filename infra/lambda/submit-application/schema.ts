import { z } from "zod";

/**
 * Server-side mirror of the frontend's application schema
 * (src/types/application.ts). Kept as a standalone copy rather than a
 * shared import so the frontend (Vite/browser) and this Lambda (Node,
 * separately deployed) stay independently buildable — duplication is
 * deliberate here, not accidental.
 */
export const submitApplicationSchema = z.object({
  applicationType: z.enum(["apartment", "rent-to-own"]),
  propertyId: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  currentStreet: z.string().min(1),
  currentCity: z.string().min(1),
  currentState: z.string().min(2).max(2),
  currentZip: z.string().min(1),
  ssnLast4: z.string().regex(/^\d{4}$/),
  driversLicenseNumber: z.string().optional(),
  driversLicenseState: z.string().optional(),
  employerName: z.string().min(1),
  jobTitle: z.string().min(1),
  employmentLength: z.string().min(1),
  monthlyIncome: z.coerce.number().positive(),
  employerPhone: z.string().min(1),
  additionalIncomeSource: z.string().optional(),
  additionalIncomeAmount: z.coerce.number().optional(),
  currentAddressDuration: z.string().min(1),
  residenceType: z.string().min(1),
  landlordName: z.string().optional(),
  landlordPhone: z.string().optional(),
  reasonForLeaving: z.string().optional(),
  occupants: z.array(
    z.object({ name: z.string().min(1), relationship: z.string().min(1), age: z.coerce.number() })
  ),
  pets: z.array(z.object({ type: z.string().min(1), breed: z.string().optional(), weight: z.string().optional() })),
  vehicles: z.array(
    z.object({
      make: z.string().min(1),
      model: z.string().min(1),
      year: z.string().optional(),
      licensePlate: z.string().optional(),
    })
  ),
  references: z
    .array(z.object({ name: z.string().min(1), relationship: z.string().min(1), phone: z.string().min(1) }))
    .min(1),
  emergencyContactName: z.string().min(1),
  emergencyContactRelationship: z.string().min(1),
  emergencyContactPhone: z.string().min(1),
  desiredDownPayment: z.coerce.number().optional(),
  purchaseTimeline: z.string().optional(),
  creditCheckConsent: z.boolean().optional(),
  estimatedCreditRange: z.string().optional(),
  certifyTrue: z.literal(true),
  authorizeBackgroundCheck: z.literal(true),
  consentEmailDelivery: z.literal(true),
  signatureFullName: z.string().min(1),
  documents: z.array(z.object({ key: z.string().min(1), filename: z.string().min(1) })).optional(),
});

export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;
