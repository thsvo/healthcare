import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SurveyQuestion from "@/models/SurveyQuestion";

// GET single question
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const question = await SurveyQuestion.findById(id);
    
    if (!question) {
      return NextResponse.json({ success: false, error: "Question not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update question
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const question = await SurveyQuestion.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!question) {
      return NextResponse.json({ success: false, error: "Question not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE question
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const question = await SurveyQuestion.findByIdAndDelete(id);
    
    if (!question) {
      return NextResponse.json({ success: false, error: "Question not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
