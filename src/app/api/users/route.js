import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
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
