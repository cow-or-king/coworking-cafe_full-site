import dbConnect from "@/lib/mongodb/dbConnect";
import Staff from "@/lib/mongodb/models/Staff";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const newStaff = await Staff.find({});
      res.status(200).json({ success: true, data: newStaff });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res.status(400).json({ success: false, error: errorMessage });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
