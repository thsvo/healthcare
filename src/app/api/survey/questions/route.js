import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SurveyQuestion from "@/models/SurveyQuestion";

// GET all questions (optionally filter by serviceId)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    
    const query = { isActive: true };
    if (serviceId) {
      query.serviceId = serviceId;
    }
    
    const questions = await SurveyQuestion.find(query).sort({ order: 1 });
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create new question
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const question = await SurveyQuestion.create(body);
    return NextResponse.json({ success: true, data: question }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
