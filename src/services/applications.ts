import type { ApplicationFormValues, ApplicationType, SubmittedApplication } from "../types/application";
import type { UploadedDocument } from "./uploads";
import { apiPost } from "./api";

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

function cacheLocally(submitted: SubmittedApplication): void {
  const all = readAll();
  all.push(submitted);
  writeAll(all);
}

/** Convenience "recently submitted on this device" list — not the source of truth. */
export function getMyApplications(): SubmittedApplication[] {
  return readAll().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

interface SubmitApplicationResponse {
  applicationId: string;
  submittedAt: string;
}

export async function submitApplication(
  applicationType: ApplicationType,
  values: ApplicationFormValues,
  documents: UploadedDocument[]
): Promise<SubmittedApplication> {
  const response = await apiPost<SubmitApplicationResponse>("/applications", {
    applicationType,
    ...values,
    documents,
  });

  const submitted: SubmittedApplication = {
    id: response.applicationId,
    applicationType,
    submittedAt: response.submittedAt,
    values,
  };

  cacheLocally(submitted);
  return submitted;
}
