import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SurveyResponse from "@/models/SurveyResponse";
import jwt from "jsonwebtoken";

// GET all users (admin only)
export async function GET(request) {
  try {
    await dbConnect();
    
    // Get current user from token
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    let currentUser = null;

    if (token) {
      try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "default_secret");
        currentUser = await User.findById(decoded.userId).select('role');
      } catch (e) {
        // Token invalid
      }
    }

    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    // Get query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const assignedDoctorId = searchParams.get("assignedDoctorId");

    let query = { role: 'user' };

    // If doctor, restricted to assigned patients
    if (currentUser.role === 'doctor') {
      query.assignedDoctorId = currentUser._id;
      // Doctors typically only see active assigned users, but let's allow seeing pending if assigned
      if (status) query.accountStatus = status;
    } 
    // If admin, can filter by status
    else if (currentUser.role === 'admin') {
      if (assignedDoctorId) query.assignedDoctorId = assignedDoctorId;
      if (status) {
        query.accountStatus = status;
      } else {
        // Default only active unless specified? Or all?
        // Let's return only active by default for main list, unless specific status requested
        // Actually, existing behavior was return all. Let's keep it configurable.
        // If no status param, return 'active' to keep main list clean, separate endpoint call for 'pending'
        query.accountStatus = 'active';
      }
    } else {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    
    const users = await User.find(query)
      .select('-password')
      .populate('assignedDoctorId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create user (admin only)
export async function POST(request) {
  try {
    await dbConnect();
    
    // Check auth
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    let currentUser = null;

    if (token) {
      try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "default_secret");
        currentUser = await User.findById(decoded.userId);
      } catch (e) {}
    }

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, firstName, lastName, phone, sex, birthday, address, city, state, zipCode } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ success: false, error: "Please provide all required fields" }, { status: 400 });
    }

    // Check existing
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 400 });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      sex,
      birthday,
      address,
      city,
      state,
      zipCode,
      role: 'user',
      accountStatus: 'active'
    });

    // Create initial survey response
    const surveyResponse = await SurveyResponse.create({
      userInfo: {
        firstName, lastName, email, phone, sex, birthday,
        address, city, state, zipCode
      },
      answers: [],
      status: "new",
      userId: user._id,
    });

    user.surveyResponseId = surveyResponse._id;
    await user.save();

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
