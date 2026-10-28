
import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

import { promisify } from "node:util";
import { env } from "../config/env.js";
import { HttpError } from "./http.js";

const scrypt = promisify(scryptCallback);

export async function hashPassword(
  password: string
): Promise<string> {
  const salt = randomBytes(16).toString("hex");

  const hash = (
    await scrypt(password, salt, 64) as Buffer
  ).toString("hex");

  return `${salt}:${hash}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [salt, hex] = stored.split(":");

  if (
    !salt ||
    !hex ||
    !/^[a-f0-9]{128}$/.test(hex)
  ) {
    return false;
  }

  const actual = await scrypt(
    password,
    salt,
    64
  ) as Buffer;

  return timingSafeEqual(
    actual,
    Buffer.from(hex, "hex")
  );
}

type Role = "customer" | "worker" | "admin";

type Claims = {
  sub: string;
  role: Role;
  sv: number;
  exp: number;
};

const b64 = (value: unknown) =>
  Buffer.from(
    JSON.stringify(value)
  ).toString("base64url");

const mac = (data: string) =>
  createHmac("sha256", env.JWT_SECRET)
    .update(data)
    .digest("base64url");

export function issueToken(user: {
  id: string;
  role: Role;
  sessionVersion: number;
}): string {
  const header = b64({
    alg: "HS256",
    typ: "JWT",
  });

  const payload = b64({
    sub: user.id,
    role: user.role,
    sv: user.sessionVersion,
    exp: Math.floor(Date.now() / 1000) + 7 * 86400,
  });

  const message = `${header}.${payload}`;

  return `${message}.${mac(message)}`;
}

export function parseToken(token: string): Claims {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new HttpError(401, "Invalid token");
  }

  const [header, payload, signature] = parts as [
    string,
    string,
    string,
  ];

  const expected = mac(`${header}.${payload}`);

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    throw new HttpError(401, "Invalid token");
  }

  let raw: unknown;

  try {
    const h = JSON.parse(
      Buffer.from(header, "base64url").toString()
    );

    if (h.alg !== "HS256" || h.typ !== "JWT") {
      throw new Error("Invalid token header");
    }

    raw = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    );
  } catch {
    throw new HttpError(401, "Invalid token");
  }

  if (!raw || typeof raw !== "object") {
    throw new HttpError(401, "Invalid token");
  }

  const claims = raw as Partial<Claims>;

  if (
    typeof claims.sub !== "string" ||
    !["customer", "worker", "admin"].includes(
      claims.role ?? ""
    ) ||
    !Number.isSafeInteger(claims.sv) ||
    (claims.sv ?? -1) < 0 ||
    !Number.isSafeInteger(claims.exp) ||
    (claims.exp ?? 0) <= Math.floor(Date.now() / 1000)
  ) {
    throw new HttpError(
      401,
      "Expired or invalid token"
    );
  }

  return claims as Claims;
}
