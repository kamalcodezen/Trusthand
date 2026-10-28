import { z } from "zod";

import {
  Location,
  type Division
} from "../models/Location.js";

import { HttpError } from "../utils/http.js";

export const addressSchema = z.object({
  division: z.string().trim().min(2).max(100),
  district: z.string().trim().min(2).max(100),
  upazila: z.string().trim().min(2).max(100)
}).strict();

export type Address =
  z.infer<typeof addressSchema>;

export async function getLocationTree():
  Promise<Division[]> {

  const doc = await Location.findOne({
    key: "BD"
  }).lean() as any;

  if (!doc?.divisions) {
    throw new HttpError(
      503,
      "Location data missing. Run: npm run seed:locations"
    );
  }

  return doc.divisions as Division[];
}

export async function validateLocation(
  address: Address
): Promise<Address> {

  const divisions = await getLocationTree();

  const norm = (x: string) =>
    x.trim().toLocaleLowerCase("en");

  const division = divisions.find(
    x => norm(x.name) === norm(address.division)
  );

  const district = division?.districts.find(
    x => norm(x.name) === norm(address.district)
  );

  const upazila = district?.upazilas.find(
    x => norm(x.name) === norm(address.upazila)
  );

  if (
    !division ||
    !district ||
    !upazila
  ) {
    throw new HttpError(
      400,
      "Invalid Division → District → Upazila combination"
    );
  }

  return {
    division: division.name,
    district: district.name,
    upazila: upazila.name
  };
}

export async function optionalAddress(
  input: Partial<
    Record<keyof Address, string | undefined>
  >
): Promise<Partial<Address>> {

  const hasAny = Boolean(
    input.division ||
    input.district ||
    input.upazila
  );

  if (!hasAny) {
    return {};
  }

  const parsed = addressSchema.safeParse(input);

  if (!parsed.success) {
    throw new HttpError(
      400,
      "Provide division, district and upazila together"
    );
  }

  return validateLocation(parsed.data);
}