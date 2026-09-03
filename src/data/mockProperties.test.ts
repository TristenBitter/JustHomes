import { describe, expect, it } from "vitest";
import { mockProperties } from "./mockProperties";

describe("mockProperties", () => {
  it("has 29 properties", () => {
    expect(mockProperties).toHaveLength(29);
  });

  it("tags every GB-coded property as an apartment", () => {
    for (const property of mockProperties) {
      if (property.internalCode?.startsWith("GB")) {
        expect(property.type, `${property.internalCode} should be an apartment`).toBe("apartment");
      }
    }
  });

  it("tags every non-GB property as a house", () => {
    for (const property of mockProperties) {
      if (!property.internalCode) {
        expect(property.type, `${property.street} should be a house`).toBe("house");
      }
    }
  });

  it("has 21 apartments and 8 houses", () => {
    const apartments = mockProperties.filter((property) => property.type === "apartment");
    const houses = mockProperties.filter((property) => property.type === "house");
    expect(apartments).toHaveLength(21);
    expect(houses).toHaveLength(8);
  });

  it("has no duplicate ids", () => {
    const ids = mockProperties.map((property) => property.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
