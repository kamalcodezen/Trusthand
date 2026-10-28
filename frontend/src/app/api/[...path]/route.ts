
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "trusthand_session";

const BACKEND = (
  process.env.BACKEND_URL ||
  "http://127.0.0.1:5000"
).replace(/\/+$/, "");

type Context = {
  params: Promise<{ path: string[] }>;
};

async function handler(
  request: NextRequest,
  context: Context
) {
  const { path } = await context.params;

  if (
    !path?.length ||
    path.some((part) => !/^[\w-]+$/.test(part))
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid API route",
      },
      { status: 400 }
    );
  }

  const route = `/${path.join("/")}`;

  const unsafe =
    request.method !== "GET" &&
    request.method !== "HEAD";

  // Validate against the actual public frontend origin.
  // Render may expose an internal origin through its proxy.
  const publicAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  const expectedOrigin = publicAppUrl
    ? new URL(publicAppUrl).origin
    : request.nextUrl.origin;

  if (
    unsafe &&
    request.headers.get("origin") !== expectedOrigin
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request origin",
      },
      { status: 403 }
    );
  }

  const token = request.cookies.get(COOKIE)?.value;

  // Revoke backend session before deleting cookie.
  if (route === "/auth/logout") {
    if (request.method !== "POST") {
      return NextResponse.json(
        {
          success: false,
          message: "Method not allowed",
        },
        { status: 405 }
      );
    }

    let revoked = !token;

    if (token) {
      try {
        const response = await fetch(
          `${BACKEND}/api/auth/logout`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            cache: "no-store",
            signal: AbortSignal.timeout(7000),
          }
        );

        revoked =
          response.ok ||
          response.status === 401;
      } catch {
        revoked = false;
      }
    }

    const result = NextResponse.json(
      revoked
        ? {
            success: true,
            data: { loggedOut: true },
          }
        : {
            success: false,
            message:
              "Signed out locally, but server session revocation could not be confirmed.",
          },
      { status: revoked ? 200 : 503 }
    );

    result.cookies.delete(COOKIE);
    return result;
  }

  const headers = new Headers({
    Accept: "application/json",
  });

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  if (unsafe) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  const isLoginOrRegister =
    (
      route === "/auth/login" ||
      route === "/auth/register"
    ) &&
    request.method === "POST";

  try {
    const requestBody = unsafe
      ? await request.text()
      : undefined;

    if (
      requestBody &&
      Buffer.byteLength(requestBody, "utf8") >
        100 * 1024
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Request is too large",
        },
        { status: 413 }
      );
    }

    const response = await fetch(
      `${BACKEND}/api${route}${request.nextUrl.search}`,
      {
        method: request.method,
        headers,
        body: requestBody,
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      }
    );

    const payload: unknown = await response
      .json()
      .catch(() => null);

    if (
      !payload ||
      typeof payload !== "object"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unexpected backend response",
        },
        { status: 502 }
      );
    }

    if (
      isLoginOrRegister &&
      response.ok &&
      "data" in payload
    ) {
      const data = (
        payload as {
          data?: {
            token?: string;
            user?: unknown;
          };
        }
      ).data;

      if (data?.token && data.user) {
        const result = NextResponse.json(
          {
            success: true,
            data: { user: data.user },
          },
          { status: response.status }
        );

        result.cookies.set(
          COOKIE,
          data.token,
          {
            httpOnly: true,
            secure:
              process.env.NODE_ENV ===
              "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          }
        );

        return result;
      }

      return NextResponse.json(
        {
          success: false,
          message: "Invalid login payload",
        },
        { status: 502 }
      );
    }

    const result = NextResponse.json(
      payload,
      { status: response.status }
    );

    if (
      response.status === 401 &&
      token
    ) {
      result.cookies.delete(COOKIE);
    }

    return result;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Backend unavailable. Check Express, MongoDB and BACKEND_URL.",
      },
      { status: 503 }
    );
  }
}

export async function GET(
  req: NextRequest,
  ctx: Context
) {
  return handler(req, ctx);
}

export async function POST(
  req: NextRequest,
  ctx: Context
) {
  return handler(req, ctx);
}

export async function PUT(
  req: NextRequest,
  ctx: Context
) {
  return handler(req, ctx);
}

export async function PATCH(
  req: NextRequest,
  ctx: Context
) {
  return handler(req, ctx);
}

export async function DELETE(
  req: NextRequest,
  ctx: Context
) {
  return handler(req, ctx);
}
