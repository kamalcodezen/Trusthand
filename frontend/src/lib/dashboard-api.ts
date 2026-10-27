
import {
  apiJson,
  getAuthToken,
  type UserRole,
} from "@/lib/trusthand-api";

export type IDObject = {
  _id: string;
  name?: string;
  category?: string;
};

export type Service = {
  _id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  slug: string;
  active: boolean;
};

export type Worker = {
  _id: string;
  name: string;
  area?: string;
  district?: string;
  bio?: string;
  available?: boolean;
  experienceYears?: number;
  startingPrice?: number;
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  verificationStatus?: string;
  services: Service[];
};

export type Booking = {
  _id: string;
  id?: string;
  customer: IDObject | string;
  worker: IDObject | string;
  service: IDObject | string;
  scheduledAt: string;
  status: string;
  amount: number;
  address?: string;
  note?: string;
};

export type Payment = {
  _id: string;
  id?: string;
  booking: IDObject | string;
  customer: IDObject | string;
  amount: number;
  platformFee: number;
  status: string;
  paidAt?: string;
};

export type Person = {
  id: string;
  name: string;
  email: string;
  status: string;
  verificationStatus?: string;
  district?: string;
  joinedAt?: string;
};

export type Profile = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  area?: string;
  bio?: string;
  experienceYears?: number;
  available?: boolean;
  services?: Service[];
  verificationStatus?: string;
  district?: string;
  upazila?: string;
};

export type Overview = {
  customers: number;
  workers: number;
  bookings: number;
  activeBookings: number;
  completedBookings: number;
  approvedWorkers: number;
  pendingVerifications: number;
  earnedFees: number;
  grossPayments: number;
  recentBookings: Array<{
    id: string;
    service: string;
    customer: string;
    worker: string;
    scheduledAt: string;
    status: string;
  }>;
};

export function apiAuth<T>(
  path: string,
  init: RequestInit = {}
) {
  const token = getAuthToken();

  if (!token) {
    return Promise.reject(
      new Error("Please sign in again.")
    );
  }

  const headers = new Headers(init.headers);

  headers.set(
    "Authorization",
    `Bearer ${token}`
  );

  return apiJson<T>(path, {
    ...init,
    headers,
  });
}

export const postJSON = (payload: unknown) => ({
  method: "POST",
  body: JSON.stringify(payload),
});

export const patchJSON = (payload: unknown) => ({
  method: "PATCH",
  body: JSON.stringify(payload),
});

export const putJSON = (payload: unknown) => ({
  method: "PUT",
  body: JSON.stringify(payload),
});

export function displayName(
  v: IDObject | string | undefined
) {
  return typeof v === "string"
    ? v
    : v?.name || "Unknown";
}

export function displayDate(
  v: string | undefined
) {
  if (!v) return "—";

  const d = new Date(v);

  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}
