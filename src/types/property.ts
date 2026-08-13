export type PropertyType = "apartment" | "house";

export interface Property {
  id: string;
  /** Internal reference code used by JustHomes staff (e.g. "GB#3"). Not shown to applicants. */
  internalCode?: string;
  type: PropertyType;
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  images: string[];
  description?: string;
}

export function formatPropertyAddress(property: Property): string {
  const line = property.unit ? `${property.street} ${property.unit}` : property.street;
  return `${line}, ${property.city}, ${property.state} ${property.zip}`;
}
