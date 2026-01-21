import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// GET all doctors (admin only)
export async function GET() {
  try {
    await dbConnect();
    
    // Find all users with role 'doctor'
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ success: true, data: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new doctor
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { email, password, firstName, lastName } = body;
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    // Create doctor
    const doctor = await User.create({
      email,
      password, // Password will be hashed by pre-save hook
      firstName,
      lastName,
      role: 'doctor', // Set role to doctor
    });
    
    // Remove password from response
    const doctorObj = doctor.toObject();
    delete doctorObj.password;
    
    return NextResponse.json({ success: true, data: doctorObj }, { status: 201 });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
