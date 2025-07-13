import dbConnect from "@/lib/mongodb/dbConnect";
import Shift from "@/lib/mongodb/models/Shift";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Récupérer tous les shifts avec tri par date et nom
    const shifts = await Shift.find({}).sort({
      date: -1,
      lastName: 1,
      firstName: 1,
    });

    console.log("Shifts récupérés pour la liste :", shifts.length);

    return NextResponse.json({ success: true, data: shifts }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors de la récupération des shifts :", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
