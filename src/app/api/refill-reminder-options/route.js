import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import RefillReminderOption from "@/models/RefillReminderOption";

// GET all refill reminder options
export async function GET() {
  try {
    await dbConnect();
    const options = await RefillReminderOption.find().sort({ order: 1, name: 1 });
    return NextResponse.json({ success: true, data: options });
  } catch (error) {
    console.error("Failed to fetch refill reminder options:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch refill reminder options" },
      { status: 500 }
    );
  }
}

// POST create new refill reminder option
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, description, order, isActive, days } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const newOption = await RefillReminderOption.create({
      name,
      description,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      days: days || 0,
    });

    return NextResponse.json({ success: true, data: newOption }, { status: 201 });
  } catch (error) {
    console.error("Failed to create refill reminder option:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Refill reminder option with this name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create refill reminder option" },
      { status: 500 }
    );
  }
}

// PUT update refill reminder option
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, name, description, order, isActive, days } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const updatedOption = await RefillReminderOption.findByIdAndUpdate(
      id,
      { name, description, order, isActive, days: days || 0 },
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return NextResponse.json(
        { success: false, error: "Refill reminder option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedOption });
  } catch (error) {
    console.error("Failed to update refill reminder option:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update refill reminder option" },
      { status: 500 }
    );
  }
}

// DELETE refill reminder option
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const deletedOption = await RefillReminderOption.findByIdAndDelete(id);

    if (!deletedOption) {
      return NextResponse.json(
        { success: false, error: "Refill reminder option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedOption });
  } catch (error) {
    console.error("Failed to delete refill reminder option:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete refill reminder option" },
      { status: 500 }
    );
  }
}
