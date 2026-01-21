import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

// GET all categories
export async function GET() {
  try {
    await dbConnect();
    
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .lean();
    
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create category
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const category = await Category.create(body);
    
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
