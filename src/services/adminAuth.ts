const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI;
const LOGOUT_URI = import.meta.env.VITE_COGNITO_LOGOUT_URI;

const VERIFIER_KEY = "justhomes.admin.pkceVerifier";
const STATE_KEY = "justhomes.admin.oauthState";
const TOKENS_KEY = "justhomes.admin.tokens";

interface StoredTokens {
  accessToken: string;
  idToken: string;
  expiresAt: number;
}

function base64UrlEncode(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomString(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes.buffer);
}

async function sha256(value: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
}

export async function beginAdminLogin(): Promise<void> {
  const verifier = randomString(32);
  const state = randomString(16);
  const challenge = base64UrlEncode(await sha256(verifier));

  sessionStorage.setItem(VERIFIER_KEY, verifier);
  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    scope: "openid email profile",
    redirect_uri: REDIRECT_URI,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  });

  window.location.assign(`https://${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`);
}

export async function completeAdminLogin(code: string, state: string): Promise<void> {
  const expectedState = sessionStorage.getItem(STATE_KEY);
  const verifier = sessionStorage.getItem(VERIFIER_KEY);

  if (!expectedState || state !== expectedState || !verifier) {
    throw new Error("Login could not be verified. Please try signing in again.");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  });

  const response = await fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error("Sign in failed. Please try again.");
  }

  const tokens = await response.json();
  const stored: StoredTokens = {
    accessToken: tokens.access_token,
    idToken: tokens.id_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  };

  sessionStorage.setItem(TOKENS_KEY, JSON.stringify(stored));
  sessionStorage.removeItem(VERIFIER_KEY);
  sessionStorage.removeItem(STATE_KEY);
}

function readTokens(): StoredTokens | null {
  const raw = sessionStorage.getItem(TOKENS_KEY);
  if (!raw) return null;

  try {
    const tokens = JSON.parse(raw) as StoredTokens;
    if (Date.now() >= tokens.expiresAt) return null;
    return tokens;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return readTokens() !== null;
}

export function getAdminAccessToken(): string | null {
  return readTokens()?.accessToken ?? null;
}

export function getAdminEmail(): string | null {
  const tokens = readTokens();
  if (!tokens) return null;

  try {
    const payload = JSON.parse(atob(tokens.idToken.split(".")[1]));
    return payload.email ?? null;
  } catch {
    return null;
  }
}

export function adminLogout(): void {
  sessionStorage.removeItem(TOKENS_KEY);
  const params = new URLSearchParams({ client_id: CLIENT_ID, logout_uri: LOGOUT_URI });
  window.location.assign(`https://${COGNITO_DOMAIN}/logout?${params.toString()}`);
}
