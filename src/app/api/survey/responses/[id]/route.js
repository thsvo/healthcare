import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SurveyResponse from "@/models/SurveyResponse";

// GET single response
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const response = await SurveyResponse.findById(id);
    
    if (!response) {
      return NextResponse.json({ success: false, error: "Response not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update response status
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const response = await SurveyResponse.findByIdAndUpdate(
      id,
      { 
        status: body.status,
        ...(body.answers && { answers: body.answers })
      },
      { new: true }
    );
    
    if (!response) {
      return NextResponse.json({ success: false, error: "Response not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
