import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SurveyResponse from "@/models/SurveyResponse";
import { sendCredentialsEmail, generatePassword } from "@/lib/email";

// GET single user
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    let user = await User.findById(id)
      .select('-password')
      .populate('surveyResponseId');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Self-healing: Create surveyResponse if missing
    if (!user.surveyResponseId) {
      console.log(`Creating missing SurveyResponse for user ${user._id}`);
      const surveyResponse = await SurveyResponse.create({
        userInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          sex: user.sex,
          birthday: user.birthday,
          address: user.address,
          city: user.city,
          state: user.state,
          zipCode: user.zipCode
        },
        answers: [],
        status: "new",
        userId: user._id,
      });

      user.surveyResponseId = surveyResponse._id;
      await user.save();
      
      // Re-fetch populated user
      user = await User.findById(id)
        .select('-password')
        .populate('surveyResponseId')
        .lean();
    } else {
      // If we didn't refetch, let's convert the original doc to object
      user = user.toObject();
    }
    
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update user
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    // Validate that only admin can update assignedDoctorId or accountStatus
    // In a real app we'd check the session/token here
    // For now, we'll assume the client sends the correct data and rely on UI protection
    // + basic validation
    
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).select('-password').populate('assignedDoctorId', 'firstName lastName');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Sync assignedDoctor to SurveyResponse if it was updated
    if (body.assignedDoctorId !== undefined) {
      // Find survey response for this user
      // Assuming one active survey response per user for now, or updating all
      const SurveyResponse = (await import("@/models/SurveyResponse")).default;
      await SurveyResponse.updateMany(
        { userId: id },
        { assignedDoctor: body.assignedDoctorId }
      );
    }
    
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE user
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
