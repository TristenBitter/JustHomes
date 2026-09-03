import { describe, expect, it } from "vitest";
import { apartmentApplicationSchema, rentToOwnApplicationSchema } from "./application";

const baseApplicant = {
  propertyId: "gb-1",
  firstName: "Jane",
  lastName: "Doe",
  dateOfBirth: "1990-01-01",
  phone: "480-555-1234",
  email: "jane@example.com",
  currentStreet: "123 Test St",
  currentCity: "Phoenix",
  currentState: "AZ",
  currentZip: "85001",
  ssnLast4: "1234",
  employerName: "Acme Co",
  jobTitle: "Manager",
  employmentLength: "2 - 5 years",
  monthlyIncome: 5000,
  employerPhone: "480-555-9999",
  currentAddressDuration: "2 - 5 years",
  residenceType: "Rent",
  occupants: [],
  pets: [],
  vehicles: [],
  references: [{ name: "John Smith", relationship: "Friend", phone: "480-555-0000" }],
  emergencyContactName: "Mary Doe",
  emergencyContactRelationship: "Sister",
  emergencyContactPhone: "480-555-1111",
  certifyTrue: true as const,
  authorizeBackgroundCheck: true as const,
  consentEmailDelivery: true as const,
  signatureFullName: "Jane Doe",
};

describe("apartmentApplicationSchema", () => {
  it("accepts a fully filled-out application", () => {
    expect(apartmentApplicationSchema.safeParse(baseApplicant).success).toBe(true);
  });

  it("rejects a missing required field", () => {
    const { firstName, ...withoutFirstName } = baseApplicant;
    void firstName;
    expect(apartmentApplicationSchema.safeParse(withoutFirstName).success).toBe(false);
  });

  it("rejects an ssnLast4 that isn't exactly 4 digits", () => {
    const result = apartmentApplicationSchema.safeParse({ ...baseApplicant, ssnLast4: "12" });
    expect(result.success).toBe(false);
  });

  it("rejects an unchecked required consent checkbox", () => {
    const result = apartmentApplicationSchema.safeParse({ ...baseApplicant, certifyTrue: false });
    expect(result.success).toBe(false);
  });

  it("rejects an application with zero references", () => {
    const result = apartmentApplicationSchema.safeParse({ ...baseApplicant, references: [] });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = apartmentApplicationSchema.safeParse({ ...baseApplicant, email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("rentToOwnApplicationSchema", () => {
  const rentToOwnApplicant = {
    ...baseApplicant,
    desiredDownPayment: 10000,
    purchaseTimeline: "1 - 3 months",
    creditCheckConsent: true as const,
  };

  it("accepts a fully filled-out rent-to-own application", () => {
    expect(rentToOwnApplicationSchema.safeParse(rentToOwnApplicant).success).toBe(true);
  });

  it("rejects a missing purchase timeline", () => {
    const { purchaseTimeline, ...withoutTimeline } = rentToOwnApplicant;
    void purchaseTimeline;
    expect(rentToOwnApplicationSchema.safeParse(withoutTimeline).success).toBe(false);
  });

  it("rejects declined credit check consent", () => {
    const result = rentToOwnApplicationSchema.safeParse({ ...rentToOwnApplicant, creditCheckConsent: false });
    expect(result.success).toBe(false);
  });
});
