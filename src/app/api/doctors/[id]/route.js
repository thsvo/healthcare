import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// GET single doctor
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Ensure the requested user is a doctor
    const doctor = await User.findOne({ _id: id, role: 'doctor' }).select('-password');
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: doctor });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update doctor
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    // Prevent role change via this endpoint
    delete body.role;
    // Dont update password here usually, unless specified
    if (!body.password) delete body.password;
    
    const doctor = await User.findOneAndUpdate(
      { _id: id, role: 'doctor' },
      body,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: doctor });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE doctor
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const doctor = await User.findOneAndDelete({ _id: id, role: 'doctor' });
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
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
