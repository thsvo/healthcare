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
    if (body.followUp !== undefined) updateData.followUp = body.followUp;
    if (body.refillReminder !== undefined) updateData.refillReminder = body.refillReminder;
    if (body.clinicalMedication !== undefined) updateData.clinicalMedication = body.clinicalMedication;
    if (body.clinicalTreatment !== undefined) updateData.clinicalTreatment = body.clinicalTreatment;
    if (body.providerNote !== undefined) updateData.providerNote = body.providerNote;


    // Handle new chat message
    if (body.newMessage) {
        console.log("Received new message payload:", body.newMessage);
        const message = {
          senderId: body.newMessage.senderId,
          senderName: body.newMessage.senderName,
          senderRole: body.newMessage.senderRole,
          text: body.newMessage.text,
          createdAt: new Date()
        };
        
        const response = await SurveyResponse.findByIdAndUpdate(
            id,
            { 
              $set: updateData,
              $push: { messages: message } 
            },
            { new: true, runValidators: true }
        ).populate({ path: 'assignedDoctor', select: 'firstName lastName email', strictPopulate: false });
        
        console.log("Updated response messages count:", response?.messages?.length);

         // Sync assignedDoctor if present
        if (body.assignedDoctor !== undefined && response.userId) {
            const User = (await import("@/models/User")).default;
            await User.findByIdAndUpdate(response.userId, { assignedDoctorId: body.assignedDoctor });
        }
        return NextResponse.json({ success: true, data: response });
    }
    
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
