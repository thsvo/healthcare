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

    // Sync assignedDoctor and Calculate/Sync Dates to User
    if (response.userId) {
      const User = (await import("@/models/User")).default;
      const userUpdate = {};
      
      if (body.assignedDoctor !== undefined) {
        userUpdate.assignedDoctorId = body.assignedDoctor;
      }

      // Helper to calculate date from duration string
      const calculateDate = (duration) => {
        if (!duration || duration === 'None') return null;
        
        const now = new Date();
        const num = parseInt(duration) || 1; // Default to 1 if just "Day" etc
        
        if (duration.toLowerCase().includes('day')) {
          now.setDate(now.getDate() + num);
        } else if (duration.toLowerCase().includes('week')) {
          now.setDate(now.getDate() + (num * 7));
        } else if (duration.toLowerCase().includes('month')) {
          now.setMonth(now.getMonth() + num);
        } else if (duration.toLowerCase().includes('year')) {
          now.setFullYear(now.getFullYear() + num);
        }
        
        return now;
      };

      if (body.followUp !== undefined) {
        // If followUp is "None" or empty, we might want to clear it, or keep existing?
        // User asked for calculation. If they change it to "1 Week", calculate.
        if (body.followUp && body.followUp !== 'None') {
           userUpdate.followUpDate = calculateDate(body.followUp);
        } else {
           // If Explicitly set to None, maybe clear it?
           // userUpdate.followUpDate = null; 
        }
      }

      if (body.refillReminder !== undefined) {
         if (body.refillReminder && body.refillReminder !== 'None') {
            userUpdate.refillReminderDate = calculateDate(body.refillReminder);
         }
      }

      if (Object.keys(userUpdate).length > 0) {
        await User.findByIdAndUpdate(response.userId, userUpdate);
      }
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
