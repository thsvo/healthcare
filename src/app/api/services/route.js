import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";

// GET all services
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    const query = activeOnly ? { isActive: true } : {};
    const services = await Service.find(query).sort({ order: 1 });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create new service
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const service = await Service.create(body);
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
