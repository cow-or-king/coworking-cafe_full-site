import dbConnect from "@/lib/mongodb/dbConnect";
import CashEntry from "@/lib/mongodb/models/CashEntry";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  await dbConnect();

  try {
    const {
      id,
      date,
      prestaB2B,
      depenses,
      virement,
      especes,
      cbClassique,
      cbSansContact,
    } = await request.json();

    // Conversion des arrays d'objets pour les champs prestaB2B et depenses
    let processedPrestaB2B: Array<{ label: string; value: number }> = [];
    let processedDepenses: Array<{ label: string; value: number }> = [];

    if (Array.isArray(prestaB2B)) {
      processedPrestaB2B = prestaB2B.map((item) => {
        if (typeof item === "object" && item !== null) {
          return { label: item.label || "", value: item.value || 0 };
        }
        return { label: "", value: 0 };
      });
    }

    if (Array.isArray(depenses)) {
      processedDepenses = depenses.map((item) => {
        if (typeof item === "object" && item !== null) {
          return { label: item.label || "", value: item.value || 0 };
        }
        return { label: "", value: 0 };
      });
    }

    const updateData = {
      date,
      prestaB2B: processedPrestaB2B,
      depenses: processedDepenses,
      virement: Number(virement) || 0,
      especes: Number(especes) || 0,
      cbClassique: Number(cbClassique) || 0,
      cbSansContact: Number(cbSansContact) || 0,
    };

    const updatedEntry = await CashEntry.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEntry) {
      return NextResponse.json(
        { success: false, error: "Entrée non trouvée" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updatedEntry });
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
