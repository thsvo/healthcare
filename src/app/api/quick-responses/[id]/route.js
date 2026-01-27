import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import QuickResponse from "@/models/QuickResponse";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token?.value) return null;
  
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "default_secret");
    return decoded;
  } catch (e) {
    return null;
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== 'admin' && user.role !== 'doctor')) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const quickResponse = await QuickResponse.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!quickResponse) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: quickResponse });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== 'admin' && user.role !== 'doctor')) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    
    const quickResponse = await QuickResponse.findByIdAndDelete(id);
    
    if (!quickResponse) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
