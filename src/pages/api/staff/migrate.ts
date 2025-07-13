import {
  migrateStaffFields,
  syncStaffFields,
} from "@/lib/mongodb/migrations/staff-fields-migration";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { action } = req.body;

  try {
    let result;

    switch (action) {
      case "migrate":
        result = await migrateStaffFields();
        break;
      case "sync":
        result = await syncStaffFields();
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Action invalide. Utilisez 'migrate' ou 'sync'",
        });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Erreur API migration:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Erreur serveur",
    });
  }
}
