import dbConnect from "@/lib/mongodb/dbConnect";
import Shift from "@/lib/mongodb/models/Shift";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { staffId, firstName, lastName, date, firstShift, secondShift } =
      await request.json();

    console.log("Requête POST reçue avec les données :", {
      staffId,
      firstName,
      lastName,
      date,
      firstShift,
      secondShift,
    });

    if (
      !staffId ||
      !firstName ||
      !lastName ||
      !date ||
      !firstShift ||
      !secondShift
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Tous les champs obligatoires doivent être fournis",
        },
        { status: 400 },
      );
    }

    // Vérifier si une entrée existe déjà pour ce staff et cette date
    const existingShift = await Shift.findOne({ staffId, date });

    if (existingShift) {
      return NextResponse.json(
        {
          success: false,
          error: "Une entrée existe déjà pour ce personnel à cette date",
        },
        { status: 409 },
      );
    }

    // Créer une nouvelle entrée de shift
    const newShift = new Shift({
      staffId,
      firstName,
      lastName,
      date,
      firstShift,
      secondShift,
    });

    const savedShift = await newShift.save();
    console.log("Shift créé avec succès :", savedShift);

    return NextResponse.json(
      { success: true, data: savedShift },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Erreur lors de la création du shift :", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staffId");
    const date = searchParams.get("date");

    // Si staffId et date sont fournis, récupérer un shift spécifique
    if (staffId && date) {
      const shift = await Shift.findOne({ staffId, date });

      if (shift) {
        return NextResponse.json({ success: true, shift }, { status: 200 });
      } else {
        // Retourner null si aucun shift n'est trouvé pour cette combinaison
        return NextResponse.json(
          { success: true, shift: null },
          { status: 200 },
        );
      }
    }

    // Sinon, retourner tous les shifts
    const shifts = await Shift.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: shifts }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors de la récupération des shifts :", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
