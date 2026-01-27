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

export async function GET() {
  try {
    await dbConnect();
    const responses = await QuickResponse.find().sort({ title: 1 });
    return NextResponse.json({ success: true, data: responses });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== 'admin' && user.role !== 'doctor')) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const quickResponse = await QuickResponse.create({
      ...body,
      createdBy: user.userId
    });
    
    return NextResponse.json({ success: true, data: quickResponse }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
