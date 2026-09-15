/**
 * Server-side mirror of the property id -> formatted address lookup in
 * src/data/mockProperties.ts. Kept as a standalone copy for the same
 * reason as schema.ts — this Lambda is deployed independently of the
 * frontend. Only used to make the admin PDF/email human-readable;
 * update alongside the frontend's mock data if it ever changes.
 */
export const propertyAddresses: Record<string, string> = {
  "laredo-st-chandler": "1201 W. Laredo St., Chandler, AZ 85224",
  "quail-ave-apache-junction": "601 E. Quail Ave., Apache Junction, AZ 85119",
  "bell-mesa": "7105 E Bell, Mesa, AZ 85208",
  "anne-ln-maricopa": "42094 W. Anne Ln., Maricopa, AZ 85138",
  "21st-ave-phoenix": "115 N 21st Ave., Phoenix, AZ 85009",
  "montecito-ave-phoenix": "7606 W Montecito Ave., Phoenix, AZ 85033",
  "madden-dr-avondale": "203 W. Madden Dr., Avondale, AZ 85323",
  "jamestown-rd-kearny": "431 W. Jamestown Rd., Kearny, AZ 85137",
  "gb-1": "116 N Martin Ave Front House, Gila Bend, AZ 85337",
  "gb-2": "116 N Martin Ave Rear House, Gila Bend, AZ 85337",
  "gb-3": "120 N Martin Ave #A, Gila Bend, AZ 85337",
  "gb-4": "120 N Martin Ave #B, Gila Bend, AZ 85337",
  "gb-5": "120 N Martin Ave #C, Gila Bend, AZ 85337",
  "gb-6": "120 N Martin Ave #D, Gila Bend, AZ 85337",
  "gb-7": "120 N Martin Ave Rear House, Gila Bend, AZ 85337",
  "gb-8": "124 N Martin Ave Front House, Gila Bend, AZ 85337",
  "gb-9": "124 N Martin Ave Rear House, Gila Bend, AZ 85337",
  "gb-10": "102 N Euclid Ave, Gila Bend, AZ 85337",
  "gb-11": "104 N Euclid Ave, Gila Bend, AZ 85337",
  "gb-12": "200 W Pima St, Gila Bend, AZ 85337",
  "gb-13": "202 W Pima St #4, Gila Bend, AZ 85337",
  "gb-14": "202 W Pima St #6, Gila Bend, AZ 85337",
  "gb-15": "202 W Pima St #7, Gila Bend, AZ 85337",
  "gb-16": "202 W Pima St #8, Gila Bend, AZ 85337",
  "gb-17": "202 W Pima St #9, Gila Bend, AZ 85337",
  "gb-18": "202 W Pima St #10, Gila Bend, AZ 85337",
  "gb-19": "216 N Scott Ave, Gila Bend, AZ 85337",
  "gb-20": "216 N Scott Ave Apt 1, Gila Bend, AZ 85337",
  "gb-21": "216 N Scott Ave Apt 2, Gila Bend, AZ 85337",
};

export function formatPropertyAddress(propertyId: string): string {
  return propertyAddresses[propertyId] ?? `Property ID: ${propertyId}`;
}
