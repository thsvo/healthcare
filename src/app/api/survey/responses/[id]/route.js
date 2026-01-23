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
    
    const updateData = {};
    if (body.status) updateData.status = body.status;
    if (body.answers) updateData.answers = body.answers;
    if (body.assignedDoctor !== undefined) updateData.assignedDoctor = body.assignedDoctor;
    
    const response = await SurveyResponse.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate({ path: 'assignedDoctor', select: 'firstName lastName email', strictPopulate: false });
    
    if (!response) {
      return NextResponse.json({ success: false, error: "Response not found" }, { status: 404 });
    }

    // Sync assignedDoctor to User if it was updated
    if (body.assignedDoctor !== undefined && response.userId) {
      const User = (await import("@/models/User")).default;
      await User.findByIdAndUpdate(
        response.userId,
        { assignedDoctorId: body.assignedDoctor }
      );
    }
    
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE response
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const response = await SurveyResponse.findByIdAndDelete(id);
    
    if (!response) {
      return NextResponse.json({ success: false, error: "Response not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Response deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
