import { describe, expect, it } from "vitest";
import {
  applicationTypeForProperty,
  getPropertiesByType,
  getPropertyById,
  searchProperties,
} from "./properties";

describe("applicationTypeForProperty", () => {
  it("maps apartment properties to the apartment application", () => {
    expect(applicationTypeForProperty("apartment")).toBe("apartment");
  });

  it("maps house properties to the rent-to-own application", () => {
    expect(applicationTypeForProperty("house")).toBe("rent-to-own");
  });
});

describe("getPropertiesByType", () => {
  it("only returns apartments when asked for apartments", () => {
    const results = getPropertiesByType("apartment");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((property) => property.type === "apartment")).toBe(true);
  });

  it("only returns houses when asked for houses", () => {
    const results = getPropertiesByType("house");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((property) => property.type === "house")).toBe(true);
  });
});

describe("getPropertyById", () => {
  it("finds a known property", () => {
    expect(getPropertyById("gb-1")?.internalCode).toBe("GB#1");
  });

  it("returns undefined for an unknown id", () => {
    expect(getPropertyById("does-not-exist")).toBeUndefined();
  });
});

describe("searchProperties", () => {
  it("matches on a partial address", () => {
    const results = searchProperties("116 N Martin");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((property) => property.street.includes("116 N Martin"))).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(searchProperties("martin ave").length).toBeGreaterThan(0);
  });

  it("returns everything for an empty query", () => {
    expect(searchProperties("").length).toBe(searchProperties("  ").length);
  });
});
