import dbConnect from "@/lib/mongodb/dbConnect";
import Shift from "@/lib/mongodb/models/Shift";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      // Récupérer les données de Shift
      const shifts = await Shift.find({});

      // Formater les données pour inclure startTime et endTime
      const formattedData = shifts.map((shift) => ({
        id: shift._id,
        firstName: shift.firstName,
        lastName: shift.lastName,
        date: shift.date,
        startTime: shift.startTime || "",
        endTime: shift.endTime || "",
      }));

      return res.status(200).json(formattedData);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de Shift :",
        error,
      );
      return res.status(500).json({ error: "Erreur serveur." });
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
}
