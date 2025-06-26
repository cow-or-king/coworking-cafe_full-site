import CashEntry from "@/lib/mongodb/models/CashEntry";
import dbConnect from "@/lib/mongodb/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ success: false, error: "ID manquant" });
      }
      const deleted = await CashEntry.findByIdAndDelete(id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, error: "Entrée non trouvée" });
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
