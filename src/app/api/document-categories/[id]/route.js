import dbConnect from "@/lib/db";
import DocumentCategory from "@/models/DocumentCategory";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const body = await req.json();
    
    const category = await DocumentCategory.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const deleted = await DocumentCategory.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
