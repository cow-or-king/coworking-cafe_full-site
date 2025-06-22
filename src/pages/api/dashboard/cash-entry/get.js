import CashEntry from "../../../../lib/mongodb/models/CashEntry";
import dbConnect from "../../../../lib/mongodb/mongodb";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const entries = await CashEntry.find({});
      res.status(200).json({ success: true, data: entries });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
