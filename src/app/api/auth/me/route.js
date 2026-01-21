import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SurveyResponse from "@/models/SurveyResponse";

import jwt from "jsonwebtoken";

// GET current user from session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    
    if (!token?.value) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token.value, process.env.JWT_SECRET || "default_secret");
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const user = await User.findById(decoded.userId)
      .select('-password')
      .populate('surveyResponseId');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("ME API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
