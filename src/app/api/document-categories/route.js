import dbConnect from "@/lib/db";
import DocumentCategory from "@/models/DocumentCategory";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const categories = await DocumentCategory.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const category = await DocumentCategory.create(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "Category already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
