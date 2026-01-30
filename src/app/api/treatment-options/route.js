import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TreatmentOption from "@/models/TreatmentOption";

// GET all treatment options
export async function GET() {
  try {
    await dbConnect();
    const options = await TreatmentOption.find().sort({ order: 1, name: 1 });
    return NextResponse.json({ success: true, data: options });
  } catch (error) {
    console.error("Failed to fetch treatment options:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch treatment options" },
      { status: 500 }
    );
  }
}

// POST create new treatment option
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, description, order, isActive, medicationId } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const newOption = await TreatmentOption.create({
      name,
      description,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      medicationId: medicationId || null,
    });

    return NextResponse.json({ success: true, data: newOption }, { status: 201 });
  } catch (error) {
    console.error("Failed to create treatment option:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Treatment option with this name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create treatment option" },
      { status: 500 }
    );
  }
}

// PUT update treatment option
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, name, description, order, isActive, medicationId } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const updatedOption = await TreatmentOption.findByIdAndUpdate(
      id,
      { name, description, order, isActive, medicationId },
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return NextResponse.json(
        { success: false, error: "Treatment option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedOption });
  } catch (error) {
    console.error("Failed to update treatment option:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update treatment option" },
      { status: 500 }
    );
  }
}

// DELETE treatment option
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

    const deletedOption = await TreatmentOption.findByIdAndDelete(id);

    if (!deletedOption) {
      return NextResponse.json(
        { success: false, error: "Treatment option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedOption });
  } catch (error) {
    console.error("Failed to delete treatment option:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete treatment option" },
      { status: 500 }
    );
  }
}
