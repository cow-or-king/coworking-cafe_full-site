import dbConnect from "@/lib/mongodb/dbConnect";
import Staff from "@/lib/mongodb/models/Staff";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  if (req.method === "PUT") {
    try {
      const { _id, ...updateData } = req.body;

      // Vérification de la présence de l'ID
      if (!_id) {
        return res
          .status(400)
          .json({ success: false, error: "ID is required" });
      }

      // Mise à jour du document
      const updatedEntry = await Staff.findByIdAndUpdate(_id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedEntry) {
        return res
          .status(404)
          .json({ success: false, error: "Staff not found" });
      }

      res.status(200).json({ success: true, data: updatedEntry });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res.status(400).json({ success: false, error: errorMessage });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
