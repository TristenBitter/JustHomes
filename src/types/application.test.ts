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
  ssn: "123-45-6789",
  employerName: "Acme Co",
  jobTitle: "Manager",
  employmentLength: "2 - 5 years",
  monthlyIncome: 5000,
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
  consentBackgroundCheckSharing: true as const,
  signatureFullName: "Jane Doe",
};

describe("apartmentApplicationSchema", () => {
  it("accepts a fully filled-out application", () => {
    const result = apartmentApplicationSchema.safeParse(baseApplicant);
    expect(result.success).toBe(true);
  });

  it("accepts an application with no employer phone (optional)", () => {
    expect(apartmentApplicationSchema.safeParse(baseApplicant).success).toBe(true);
  });

  it("rejects a missing required field", () => {
    const { firstName, ...withoutFirstName } = baseApplicant;
    void firstName;
    expect(apartmentApplicationSchema.safeParse(withoutFirstName).success).toBe(false);
  });

  it("rejects a full SSN that isn't formatted as 000-00-0000", () => {
    expect(apartmentApplicationSchema.safeParse({ ...baseApplicant, ssn: "123456789" }).success).toBe(false);
    expect(apartmentApplicationSchema.safeParse({ ...baseApplicant, ssn: "123-45-678" }).success).toBe(false);
  });

  it("rejects a phone number that isn't 10 digits", () => {
    expect(apartmentApplicationSchema.safeParse({ ...baseApplicant, phone: "480-555-12" }).success).toBe(false);
  });

  it("accepts an optional employer phone when it is a valid 10-digit number", () => {
    const result = apartmentApplicationSchema.safeParse({ ...baseApplicant, employerPhone: "480-555-9999" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid calendar date of birth", () => {
    expect(apartmentApplicationSchema.safeParse({ ...baseApplicant, dateOfBirth: "1990-02-30" }).success).toBe(
      false
    );
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

  it("rejects a pet with no breed", () => {
    const result = apartmentApplicationSchema.safeParse({
      ...baseApplicant,
      pets: [{ type: "Dog", breed: "" }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts a pet with type and breed", () => {
    const result = apartmentApplicationSchema.safeParse({
      ...baseApplicant,
      pets: [{ type: "Dog", breed: "Labrador" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an occupant with an unrealistic age", () => {
    const result = apartmentApplicationSchema.safeParse({
      ...baseApplicant,
      occupants: [{ name: "Someone", relationship: "Child", age: 200 }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts an application listing other adult applicants", () => {
    const result = apartmentApplicationSchema.safeParse({
      ...baseApplicant,
      occupants: [{ name: "John Doe", relationship: "Spouse", age: 32 }],
      otherAdultApplicants: "John Doe",
    });
    expect(result.success).toBe(true);
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
