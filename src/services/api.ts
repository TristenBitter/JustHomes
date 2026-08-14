const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;
  issues?: unknown;

  constructor(status: number, message: string, issues?: unknown) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

async function request<T>(path: string, options: RequestInit = {}, accessToken?: string): Promise<T> {
  if (!API_URL) {
    throw new ApiError(0, "The application backend isn't configured yet (missing VITE_API_URL).");
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json() : undefined;

  if (!response.ok) {
    throw new ApiError(response.status, body?.message ?? "Request failed.", body?.issues);
  }

  return body as T;
}

export function apiGet<T>(path: string, accessToken?: string): Promise<T> {
  return request<T>(path, { method: "GET" }, accessToken);
}

export function apiPost<T>(path: string, body: unknown, accessToken?: string): Promise<T> {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) }, accessToken);
}
