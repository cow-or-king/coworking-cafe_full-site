import dbConnect from "@/lib/mongodb/dbConnect";
import Staff from "@/lib/mongodb/models/Staff";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  // console.log("Méthode reçue :", req.method);

  if (req.method === "POST") {
    try {
      // console.log("Données reçues :", req.body);

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
        mdp, // Champ pour le mot de passe ou l'identifiant,
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
        mdp,
        active, // Enregistrement de l'état actif
      });

      // console.log("Staff créé avec succès :", entry);
      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Erreur lors de la création du staff :", errorMessage);
      res.status(400).json({ success: false, error: errorMessage });
    }
  } else {
    console.error("Méthode non autorisée :", req.method);
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
