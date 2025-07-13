import {
  checkFieldsStatus,
  cleanupLegacyFields,
} from "@/lib/mongodb/migrations/cleanup-legacy-fields";
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
      case "cleanup":
        result = await cleanupLegacyFields();
        break;
      case "check":
        result = await checkFieldsStatus();
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Action invalide. Utilisez 'cleanup' ou 'check'",
        });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Erreur API cleanup:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Erreur serveur",
    });
  }
}
