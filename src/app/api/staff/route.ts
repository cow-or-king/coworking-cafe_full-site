import dbConnect from "@/lib/mongodb/dbConnect";
import Staff from "@/lib/mongodb/models/Staff";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const newStaff = await Staff.find({});
    return NextResponse.json(
      { success: true, data: newStaff },
      { status: 200 },
    );
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 },
    );
  }
}
