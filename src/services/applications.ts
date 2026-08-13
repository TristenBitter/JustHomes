import type { ApplicationFormValues, ApplicationType, SubmittedApplication } from "../types/application";

const STORAGE_KEY = "justhomes.myApplications";

function readAll(): SubmittedApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SubmittedApplication[]) : [];
  } catch {
    return [];
  }
}

function writeAll(applications: SubmittedApplication[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

export function getMyApplications(): SubmittedApplication[] {
  return readAll().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export function saveApplication(
  applicationType: ApplicationType,
  values: ApplicationFormValues
): SubmittedApplication {
  const submitted: SubmittedApplication = {
    id: crypto.randomUUID(),
    applicationType,
    submittedAt: new Date().toISOString(),
    values,
  };

  const all = readAll();
  all.push(submitted);
  writeAll(all);

  return submitted;
}
