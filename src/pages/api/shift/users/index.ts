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
      // Récupérer les utilisateurs uniques à partir des champs firstName et lastName
      const shifts = await Shift.aggregate([
        {
          $group: {
            _id: "$staffId",
            firstName: { $first: "$firstName" },
            lastName: { $first: "$lastName" },
            dates: { $addToSet: "$date" }, // Ajout des dates uniques
          },
        },
        {
          $project: {
            _id: 0,
            fullName: { $concat: ["$firstName", " ", "$lastName"] },
            dates: 1, // Inclure les dates dans le résultat
          },
        },
      ]);

      const userNames = shifts.map((shift) => shift.fullName);
      const allDates = shifts.flatMap((shift) => shift.dates); // Extraire toutes les dates
      console.log("Utilisateurs uniques récupérés :", userNames);
      console.log("Dates récupérées :", allDates);

      return res
        .status(200)
        .json({ success: true, users: userNames, dates: allDates });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des utilisateurs uniques :",
        error,
      );
      return res.status(500).json({ error: "Erreur serveur." });
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
}
