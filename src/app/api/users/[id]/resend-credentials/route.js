import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendCredentialsEmail, generatePassword } from "@/lib/email";

// POST resend credentials to user
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    // Generate new password
    const newPassword = generatePassword(10);
    
    // Update user password
    user.password = newPassword;
    await user.save();
    
    // Send credentials email
    const emailSent = await sendCredentialsEmail(
      user.email,
      user.firstName || 'User',
      newPassword
    );
    
    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: "Failed to send credentials email" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "New credentials sent successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
