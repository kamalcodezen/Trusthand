
import { NextRequest, NextResponse } from "next/server";

const COOKIE = "trusthand_session";
const BACKEND = (
  process.env.BACKEND_URL || "http://127.0.0.1:5000"
).replace(/\/+$/, "");

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value;
  const login = new URL("/login", request.url);

  login.searchParams.set("next", request.nextUrl.pathname);

  if (!token) {
    return NextResponse.redirect(login);
  }

  try {
    const answer = await fetch(`${BACKEND}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!answer.ok) {
      const denied = NextResponse.redirect(login);
      denied.cookies.delete(COOKIE);
      return denied;
    }

    const result = await answer.json() as {
      data?: { role?: string };
    };

    const role = result.data?.role;

    if (
      !role ||
      !["customer", "worker", "admin"].includes(role)
    ) {
      return NextResponse.redirect(login);
    }

    const parts = request.nextUrl.pathname
      .split("/")
      .filter(Boolean);

    if (!parts[1] || parts[1] !== role) {
      return NextResponse.redirect(
        new URL(`/dashboard/${role}`, request.url)
      );
    }

    return NextResponse.next();
  } catch {
    return new NextResponse(
      "Authentication service temporarily unavailable",
      { status: 503 }
    );
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
