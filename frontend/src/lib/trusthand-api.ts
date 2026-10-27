
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export type LocationOption = {
  name: string;
  bnName: string;
};

export type UserRole = "customer" | "worker" | "admin";

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    area?: string;
    division?: string;
    district?: string;
    upazila?: string;
  };
};

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export async function apiJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Backend unreachable. Check that the TrustHand backend is running and NEXT_PUBLIC_API_URL is set correctly."
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | null;

  if (!response.ok || payload?.success === false) {
    throw new Error(
      payload?.message || `Server returned HTTP ${response.status}.`
    );
  }

  if (!payload || payload.data === undefined) {
    throw new Error("Unexpected response from the TrustHand backend.");
  }

  return payload.data;
}

// Temporary MVP authentication storage.
// Replace with secure HttpOnly cookie sessions for production.
export function saveAuth({ token, user }: AuthResponse): void {
  sessionStorage.setItem("trusthand_token", token);
  sessionStorage.setItem("trusthand_user", JSON.stringify(user));
}

export function getAuthToken(): string | null {
  return typeof window === "undefined"
    ? null
    : sessionStorage.getItem("trusthand_token");
}

export function clearAuth(): void {
  sessionStorage.removeItem("trusthand_token");
  sessionStorage.removeItem("trusthand_user");
}
