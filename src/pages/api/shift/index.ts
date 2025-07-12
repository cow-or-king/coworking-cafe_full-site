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
      const { staffId, firstName, lastName, date, firstShift, secondShift } =
        req.body;

      console.log("Requête POST reçue avec les données :", req.body);

      if (
        !staffId ||
        !firstName ||
        !lastName ||
        !date ||
        !firstShift ||
        !secondShift
      ) {
        console.error("Validation échouée :", {
          staffId,
          firstName,
          lastName,
          date,
          firstShift,
          secondShift,
        });
        return res.status(400).json({ error: "Tous les champs sont requis." });
      }

      // Vérifier si un shift existe déjà pour cette date et ce staff
      const existingShift = await Shift.findOne({ staffId, date });
      if (existingShift) {
        console.error("Un shift existe déjà pour cette date.");
        return res.status(400).json({
          error: "Un shift existe déjà pour cette date.",
        });
      }

      try {
        const newShift = await Shift.create({
          staffId,
          firstName,
          lastName,
          date,
          firstShift,
          secondShift,
        });

        console.log("Shift créé avec succès :", newShift);
        return res.status(201).json({ success: true, shift: newShift });
      } catch (error) {
        console.error("Erreur lors de la création du shift :", error);
        return res.status(500).json({ error: "Erreur serveur." });
      }
    } catch (error) {
      console.error("Erreur générale POST :", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  } else if (req.method === "PUT") {
    try {
      const { _id, firstShift, secondShift } = req.body;

      console.log("Requête PUT reçue avec les données :", req.body);

      if (!_id || (!firstShift && !secondShift)) {
        console.error("Validation échouée :", { _id, firstShift, secondShift });
        return res
          .status(400)
          .json({ error: "ID et au moins un shift sont requis." });
      }

      // Rechercher par `_id` unique
      const existingShift = await Shift.findById(_id);
      console.log("Résultat de la recherche par _id :", existingShift);

      if (!existingShift) {
        console.error("Aucun shift trouvé avec _id :", _id);
        return res.status(404).json({ error: "Shift non trouvé." });
      }

      // Préparer les données de mise à jour
      const updateData: any = {};
      if (firstShift) updateData.firstShift = firstShift;
      if (secondShift) updateData.secondShift = secondShift;

      console.log("Données de mise à jour :", updateData);

      // Mettre à jour le shift
      const updatedShift = await Shift.findByIdAndUpdate(_id, updateData, {
        new: true,
      });

      if (!updatedShift) {
        console.error("Erreur lors de la mise à jour du shift.");
        return res.status(500).json({ error: "Erreur serveur." });
      }

      console.log("Shift mis à jour avec succès :", updatedShift);
      return res.status(200).json({ success: true, shift: updatedShift });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du shift :", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  } else if (req.method === "GET") {
    try {
      const { staffId, date } = req.query;

      console.log("Requête GET reçue avec les paramètres :", req.query);

      if (!staffId || !date) {
        console.error("Validation échouée :", { staffId, date });
        return res.status(400).json({ error: "staffId et date sont requis." });
      }

      const shift = await Shift.findOne({ staffId, date });
      console.log("Shift trouvé :", shift);

      if (shift) {
        return res.status(200).json({ success: true, shift });
      } else {
        return res.status(200).json({
          success: true,
          shift: null,
          message: "Aucun shift trouvé pour cette date.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du shift :", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
}
