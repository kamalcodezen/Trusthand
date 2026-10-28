
import {
  NextRequest,
  NextResponse,
} from "next/server";

const COOKIE = "trusthand_session";

const BACKEND = (
  process.env.BACKEND_URL ||
  "http://127.0.0.1:5000"
).replace(/\/+$/, "");

const ROLES = [
  "customer",
  "worker",
  "admin",
];

export async function proxy(
  request: NextRequest
) {
  const token = request.cookies.get(COOKIE)?.value;

  const login = new URL(
    "/login",
    request.url
  );

  login.searchParams.set(
    "next",
    request.nextUrl.pathname
  );

  if (!token) {
    return NextResponse.redirect(login);
  }

  try {
    const response = await fetch(
      `${BACKEND}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }
    );

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      const redirect = NextResponse.redirect(
        login
      );

      redirect.cookies.delete(COOKIE);
      return redirect;
    }

    if (!response.ok) {
      return new NextResponse(
        "Account verification unavailable",
        { status: 503 }
      );
    }

    const result: {
      data?: { role?: string };
    } = await response.json();

    const role = result.data?.role;

    if (
      !role ||
      !ROLES.includes(role)
    ) {
      return NextResponse.redirect(login);
    }

    const requestedRole = request.nextUrl.pathname
      .split("/")
      .filter(Boolean)[1];

    if (
      requestedRole &&
      requestedRole !== role
    ) {
      return NextResponse.redirect(
        new URL(
          `/dashboard/${role}`,
          request.url
        )
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
