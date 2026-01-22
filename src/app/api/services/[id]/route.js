import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";

// GET single service
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const service = await Service.findById(id);
    
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update service
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const service = await Service.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE service
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
