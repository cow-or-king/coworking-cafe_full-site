import dbConnect from "@/lib/mongodb/dbConnect";
import Staff from "@/lib/mongodb/models/Staff";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const {
        firstName,
        lastName,
        email,
        tel,
        numberSecu,
        adresse,
        zipcode,
        city,
        framework,
        times,
        hourlyRate,
        startDate,
        endDate,
        contract,
        active = true, // Champ actif par défaut à true
      } = req.body;
      const entry = await Staff.create({
        firstName,
        lastName,
        email,
        tel,
        numberSecu,
        adresse,
        zipcode,
        city,
        framework,
        times,
        hourlyRate,
        startDate,
        endDate,
        contract,
        active, // Enregistrement de l'état actif
      });
      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res.status(400).json({ success: false, error: errorMessage });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
