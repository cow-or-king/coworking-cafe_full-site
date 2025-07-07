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

      console.log("Requête reçue avec les données :", req.body);

      if (
        !staffId ||
        !firstName ||
        !lastName ||
        !date ||
        !startTime ||
        !endTime
      ) {
        console.error("Validation échouée :", {
          staffId,
          firstName,
          lastName,
          date,
          startTime,
          endTime,
        });
        return res.status(400).json({ error: "Tous les champs sont requis." });
      }

      // Vérifier le nombre de pointages existants pour le staff et la date
      const existingShifts = await Shift.find({ staffId, date });
      if (existingShifts.length >= 2) {
        console.error("Limite de pointages atteinte pour aujourd'hui.");
        return res.status(400).json({
          error: "Limite de pointages atteinte pour aujourd'hui.",
        });
      }

      try {
        const newShift = await Shift.create({
          staffId,
          firstName,
          lastName,
          date,
          startTime,
          endTime,
        });

        console.log("Pointage enregistré avec succès :", newShift);
        return res.status(201).json({ success: true, shift: newShift });
      } catch (error) {
        console.error("Erreur lors de la création du pointage :", error);
        return res.status(500).json({ error: "Erreur serveur." });
      }
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur." });
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
}
