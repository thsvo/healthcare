import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET notes for a user
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const notes = await Note.find({ userId: id })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create new note
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    // Get current user from token
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    let createdById = null;
    
    if (token?.value) {
      try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "default_secret");
        createdById = decoded.userId;
      } catch (e) {}
    }
    
    const note = await Note.create({
      userId: id,
      type: body.type,
      content: body.content,
      createdBy: createdById,
    });
    
    const populatedNote = await Note.findById(note._id)
      .populate('createdBy', 'firstName lastName');
    
    return NextResponse.json({ success: true, data: populatedNote });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE note
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("noteId");
    
    if (!noteId) {
      return NextResponse.json({ success: false, error: "Note ID required" }, { status: 400 });
    }
    
    await Note.findByIdAndDelete(noteId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
