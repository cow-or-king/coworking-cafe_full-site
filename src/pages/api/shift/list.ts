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
      // Récupérer tous les shifts avec tri par date et nom
      const shifts = await Shift.find({}).sort({
        date: -1,
        lastName: 1,
        firstName: 1,
      });

      console.log("Shifts récupérés pour la liste :", shifts.length);

      return res.status(200).json({
        success: true,
        shifts: shifts || [],
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des shifts :", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
}
