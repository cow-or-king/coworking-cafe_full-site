import CashEntry from "@/lib/mongodb/models/CashEntry";
import dbConnect from "@/lib/mongodb/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const {
        _id,
        date,
        prestaB2B,
        depenses,
        especes,
        cbClassique,
        cbSansContact,
      } = req.body;
      const entry = await CashEntry.create({
        _id,
        date,
        prestaB2B, // attend un tableau [{label, value}]
        depenses, // attend un tableau [{label, value}]
        especes,
        cbClassique,
        cbSansContact,
      });
      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
