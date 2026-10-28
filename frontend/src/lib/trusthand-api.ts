
export type LocationOption = {
  name: string;
  bnName: string;
};

export type UserRole =
  | "customer"
  | "worker"
  | "admin";

export type AuthResponse = {
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
  if (
    !path.startsWith("/api/") ||
    path.startsWith("//")
  ) {
    throw new Error("Invalid API path");
  }

  const headers = new Headers(
    init.headers
  );

  if (
    init.body &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      headers,
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Unable to connect to TrustHand API."
    );
  }

  const payload = (
    await response.json().catch(() => null)
  ) as ApiEnvelope<T> | null;

  if (
    !response.ok ||
    payload?.success === false
  ) {
    throw new Error(
      payload?.message ||
      `HTTP ${response.status}`
    );
  }

  if (
    !payload ||
    (
      payload.data === undefined &&
      (init.method || "GET").toUpperCase() === "GET"
    )
  ) {
    throw new Error(
      "Unexpected backend response"
    );
  }

  return payload.data as T;
}

// User information is UI-only;
// session credentials stay in HttpOnly cookie.
export function saveAuth({
  user,
}: AuthResponse) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      "trusthand_user",
      JSON.stringify(user)
    );
  }
}

export async function clearAuth(): Promise<void> {
  const result = await fetch(
    "/api/auth/logout",
    {
      method: "POST",
      credentials: "same-origin",
    }
  );

  if (typeof window !== "undefined") {
    sessionStorage.removeItem(
      "trusthand_user"
    );
  }

  if (!result.ok) {
    throw new Error(
      "Local sign-out completed, but server revocation could not be confirmed."
    );
  }
}
