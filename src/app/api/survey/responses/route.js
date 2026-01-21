import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SurveyResponse from "@/models/SurveyResponse";

// GET all responses
export async function GET() {
  try {
    await dbConnect();
    const responses = await SurveyResponse.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: responses });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
