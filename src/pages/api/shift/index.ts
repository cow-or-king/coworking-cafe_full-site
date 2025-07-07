import dbConnect from "@/lib/mongodb/dbConnect";
import Shift from "@/lib/mongodb/models/Shift";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { staffId, firstName, lastName, date, startTime, endTime } =
        req.body;

      if (
        !staffId ||
        !firstName ||
        !lastName ||
        !date ||
        !startTime ||
        !endTime
      ) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
      }

      const newShift = await Shift.create({
        staffId,
        firstName,
        lastName,
        date,
        startTime,
        endTime,
      });

      return res.status(201).json({ success: true, shift: newShift });
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur." });
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
}
