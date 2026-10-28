
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "trusthand_session";
const BACKEND = (
  process.env.BACKEND_URL || "http://127.0.0.1:5000"
).replace(/\/+$/, "");

type Context = {
  params: Promise<{ path: string[] }>;
};

async function handler(request: NextRequest, context: Context) {
  const { path } = await context.params;

  if (
    !path?.length ||
    path.some((part) => !/^[\w-]+$/.test(part))
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid API route" },
      { status: 400 }
    );
  }

  const route = `/${path.join("/")}`;

  if (request.method !== "GET") {
    const origin = request.headers.get("origin");

    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json(
        { success: false, message: "Invalid origin" },
        { status: 403 }
      );
    }
  }

  if (route === "/auth/logout") {
    if (request.method !== "POST") {
      return NextResponse.json(
        { success: false, message: "Method not allowed" },
        { status: 405 }
      );
    }

    const result = NextResponse.json({
      success: true,
      data: { loggedOut: true },
    });

    result.cookies.delete(COOKIE);
    return result;
  }

  const token = request.cookies.get(COOKIE)?.value;
  const headers = new Headers({
    Accept: "application/json",
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (request.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  const isAuth =
    (route === "/auth/login" || route === "/auth/register") &&
    request.method === "POST";

  try {
    const response = await fetch(
      `${BACKEND}/api${route}${request.nextUrl.search}`,
      {
        method: request.method,
        headers,
        body:
          request.method === "GET"
            ? undefined
            : await request.text(),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      }
    );

    const payload: unknown = await response
      .json()
      .catch(() => null);

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { success: false, message: "Unexpected backend response" },
        { status: 502 }
      );
    }

    if (isAuth && response.ok && "data" in payload) {
      const data = (
        payload as {
          data?: { token?: string; user?: unknown };
        }
      ).data;

      if (data?.token && data.user) {
        const result = NextResponse.json(
          { success: true, data: { user: data.user } },
          { status: response.status }
        );

        result.cookies.set(COOKIE, data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });

        return result;
      }

      return NextResponse.json(
        {
          success: false,
          message: "Invalid login payload from backend",
        },
        { status: 502 }
      );
    }

    const result = NextResponse.json(payload, {
      status: response.status,
    });

    if (response.status === 401 && token) {
      result.cookies.delete(COOKIE);
    }

    return result;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Backend not reachable. Check Express, MongoDB and BACKEND_URL.",
      },
      { status: 503 }
    );
  }
}

export async function GET(req: NextRequest, ctx: Context) {
  return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: Context) {
  return handler(req, ctx);
}

export async function PUT(req: NextRequest, ctx: Context) {
  return handler(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: Context) {
  return handler(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: Context) {
  return handler(req, ctx);
}
