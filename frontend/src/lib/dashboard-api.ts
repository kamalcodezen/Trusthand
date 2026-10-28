
import {
  apiJson,
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
  isDemo?: boolean;
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
): Promise<T> {
  return apiJson<T>(path, init);
}

export const postJSON = (
  payload: unknown
) => ({
  method: "POST",
  body: JSON.stringify(payload),
});

export const patchJSON = (
  payload: unknown
) => ({
  method: "PATCH",
  body: JSON.stringify(payload),
});

export const putJSON = (
  payload: unknown
) => ({
  method: "PUT",
  body: JSON.stringify(payload),
});

export function displayName(
  value: IDObject | string | undefined
): string {
  return typeof value === "string"
    ? value
    : value?.name || "Unknown";
}

export function displayDate(
  value: string | undefined
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}
