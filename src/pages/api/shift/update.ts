import dbConnect from "@/lib/mongodb/dbConnect";
import Shift from "@/lib/mongodb/models/Shift";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { shiftId, field, value } = req.body;

    if (!shiftId || !field || value === undefined) {
      return res.status(400).json({
        message: "Missing required fields: shiftId, field, value",
      });
    }

    // Construire l'objet de mise à jour
    const updateObj: any = {};
    updateObj[field] = value;

    // Mettre à jour le shift
    const updatedShift = await Shift.findByIdAndUpdate(
      shiftId,
      { $set: updateObj },
      { new: true, runValidators: true },
    );

    if (!updatedShift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    console.log(`Shift ${shiftId} updated: ${field} = ${value}`);

    res.status(200).json({
      message: "Shift updated successfully",
      shift: updatedShift,
    });
  } catch (error) {
    console.error("Error updating shift:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
