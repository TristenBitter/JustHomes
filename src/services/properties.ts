import { mockProperties } from "../data/mockProperties";
import { formatPropertyAddress, type Property, type PropertyType } from "../types/property";

export function getProperties(): Property[] {
  return mockProperties;
}

export function getPropertiesByType(type: PropertyType): Property[] {
  return mockProperties.filter((property) => property.type === type);
}

export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find((property) => property.id === id);
}

export function searchProperties(query: string): Property[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return mockProperties;

  return mockProperties.filter((property) =>
    formatPropertyAddress(property).toLowerCase().includes(normalized)
  );
}

export function applicationTypeForProperty(type: PropertyType): "apartment" | "rent-to-own" {
  return type === "apartment" ? "apartment" : "rent-to-own";
}
