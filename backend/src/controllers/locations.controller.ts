import type { RequestHandler } from "express";

import {
  getLocationTree
} from "../services/location.service.js";

import {
  q,
  HttpError
} from "../utils/http.js";

const simple = (x: {
  name: string;
  bnName: string;
}) => ({
  name: x.name,
  bnName: x.bnName
});

const locate = <T extends { name: string }>(
  items: T[],
  name: string
): T | undefined =>
  items.find(
    x =>
      x.name.toLowerCase() === name.toLowerCase()
  );

export const divisions: RequestHandler =
  async (_req, res) => {
    const tree = await getLocationTree();

    res.json({
      success: true,
      data: tree.map(simple)
    });
  };

export const districts: RequestHandler =
  async (req, res) => {
    const tree = await getLocationTree();

    const division = locate(
      tree,
      q(req, "division")
    );

    if (!division) {
      throw new HttpError(
        400,
        "Choose a valid division"
      );
    }

    res.json({
      success: true,
      data: division.districts.map(simple)
    });
  };

export const upazilas: RequestHandler =
  async (req, res) => {
    const tree = await getLocationTree();

    const division = locate(
      tree,
      q(req, "division")
    );

    const district =
      division &&
      locate(
        division.districts,
        q(req, "district")
      );

    if (!district) {
      throw new HttpError(
        400,
        "Choose a valid division and district"
      );
    }

    res.json({
      success: true,
      data: district.upazilas.map(simple)
    });
  };