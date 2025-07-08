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

      // console.log("Requête reçue avec les données :", req.body);

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

        // console.log("Pointage enregistré avec succès :", newShift);
        // console.log("Shift créé avec succès, données retournées :", newShift);
        return res.status(201).json({ success: true, shift: newShift });
      } catch (error) {
        console.error("Erreur lors de la création du pointage :", error);
        return res.status(500).json({ error: "Erreur serveur." });
      }
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur." });
    }
  } else if (req.method === "PUT") {
    try {
      const { _id, endTime } = req.body;

      // console.log("Requête PUT reçue avec les données :", req.body);

      if (!_id || !endTime) {
        console.error("Validation échouée :", { _id, endTime });
        return res.status(400).json({ error: "Tous les champs sont requis." });
      }

      // Rechercher par `_id` unique
      const existingShift = await Shift.findById(_id);
      // console.log("Résultat de la recherche par _id :", existingShift);

      if (!existingShift) {
        console.error("Aucun pointage trouvé avec _id :", _id);
        return res.status(404).json({ error: "Pointage non trouvé." });
      }

      // console.log("Pointage trouvé avant mise à jour :", existingShift);

      // Mettre à jour la valeur de stop pour le pointage existant
      const updatedShift = await Shift.findByIdAndUpdate(
        _id, // Utiliser `_id` pour la mise à jour
        { endTime }, // Mettre à jour avec la valeur réelle
        { new: true },
      );

      if (!updatedShift) {
        console.error("Erreur lors de la mise à jour du pointage.");
        return res.status(500).json({ error: "Erreur serveur." });
      }

      // console.log("Pointage mis à jour avec succès :", updatedShift);
      return res.status(200).json({ success: true, shift: updatedShift });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du pointage :", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  } else if (req.method === "GET") {
    try {
      const { staffId, date } = req.query;

      // console.log("Requête GET reçue avec les paramètres :", req.query);

      if (!staffId || !date) {
        console.error("Validation échouée :", { staffId, date });
        return res.status(400).json({ error: "staffId et date sont requis." });
      }

      const shifts = await Shift.find({ staffId, date });
      // console.log("Shifts trouvés :", shifts);

      return res.status(200).json({ success: true, shifts });
    } catch (error) {
      console.error("Erreur lors de la récupération des shifts :", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
}
