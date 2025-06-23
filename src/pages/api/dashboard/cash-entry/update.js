import CashEntry from "../../../../lib/mongodb/models/CashEntry";
import dbConnect from "../../../../lib/mongodb/mongodb";

export default async function handler(req, res) {
  console.log("API update appelée, méthode:", req.method, "body:", req.body);
  await dbConnect();

  if (req.method === "PUT") {
    const {
      id,
      date,
      prestaB2B,
      depenses,
      especes,
      cbClassique,
      cbSansContact,
    } = req.body;
    console.log("ID reçu pour update:", id);

    if (!id || !date) {
      return res
        .status(400)
        .json({ success: false, error: "ID et date requis" });
    }

    try {
      // Vérifie si une entrée existe avec cet _id
      const existingEntry = await CashEntry.findById(id);

      if (existingEntry) {
        // Mise à jour de l'entrée existante
        const updated = await CashEntry.findByIdAndUpdate(
          id,
          { date, prestaB2B, depenses, especes, cbClassique, cbSansContact },
          { new: true, runValidators: true },
        );
        return res.status(200).json({ success: true, data: updated });
      } else {
        // Si aucune entrée n'existe avec cet _id, retourner une erreur
        return res
          .status(404)
          .json({ success: false, error: "Entrée introuvable" });
      }
    } catch (error) {
      console.error("Error updating cash entry:", error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
