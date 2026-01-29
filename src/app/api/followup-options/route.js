import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FollowUpOption from "@/models/FollowUpOption";

// GET all follow-up options
export async function GET() {
  try {
    await dbConnect();
    const options = await FollowUpOption.find().sort({ order: 1, name: 1 });
    return NextResponse.json({ success: true, data: options });
  } catch (error) {
    console.error("Failed to fetch follow-up options:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch follow-up options" },
      { status: 500 }
    );
  }
}

// POST create new follow-up option
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, description, order, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const newOption = await FollowUpOption.create({
      name,
      description,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, data: newOption }, { status: 201 });
  } catch (error) {
    console.error("Failed to create follow-up option:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Follow-up option with this name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create follow-up option" },
      { status: 500 }
    );
  }
}

// PUT update follow-up option
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, name, description, order, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const updatedOption = await FollowUpOption.findByIdAndUpdate(
      id,
      { name, description, order, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return NextResponse.json(
        { success: false, error: "Follow-up option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedOption });
  } catch (error) {
    console.error("Failed to update follow-up option:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update follow-up option" },
      { status: 500 }
    );
  }
}

// DELETE follow-up option
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

    const deletedOption = await FollowUpOption.findByIdAndDelete(id);

    if (!deletedOption) {
      return NextResponse.json(
        { success: false, error: "Follow-up option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedOption });
  } catch (error) {
    console.error("Failed to delete follow-up option:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete follow-up option" },
      { status: 500 }
    );
  }
}
