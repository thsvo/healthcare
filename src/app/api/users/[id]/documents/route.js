import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// POST add document
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    // body: { url, name, type }
    if (!body.url || !body.name) {
      return NextResponse.json(
        { success: false, error: "Missing document details" },
        { status: 400 }
      );
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { $push: { documents: body } },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: user.documents });
  } catch (error) {
    console.error("DOCS POST API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE document
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get("docId");
    
    if (!docId) {
      return NextResponse.json(
        { success: false, error: "Document ID required" },
        { status: 400 }
      );
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { documents: { _id: docId } } },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: user.documents });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
