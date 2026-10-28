
export type LocationOption = {
  name: string;
  bnName: string;
};

export type UserRole = "customer" | "worker" | "admin";

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
  if (!path.startsWith("/api/") || path.startsWith("//")) {
    throw new Error("Invalid API path");
  }

  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
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
      "Unable to connect to the app API. Is Next.js running?"
    );
  }

  const payload = (await response
    .json()
    .catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || payload?.success === false) {
    throw new Error(
      payload?.message || `HTTP ${response.status}`
    );
  }

  if (
    !payload ||
    (payload.data === undefined &&
      (init.method || "GET").toUpperCase() === "GET")
  ) {
    throw new Error("Unexpected response from backend");
  }

  return payload.data as T;
}

export function saveAuth({ user }: AuthResponse) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      "trusthand_user",
      JSON.stringify(user)
    );
  }
}

export async function clearAuth(): Promise<void> {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("trusthand_user");
  }

  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });
}
