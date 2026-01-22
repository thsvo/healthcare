import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SurveyResponse from "@/models/SurveyResponse";
// Import models to ensure they're registered before populate
import "@/models/Service";
import "@/models/User";

// GET all responses with service info
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    const query = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;
    
    const responses = await SurveyResponse.find(query)
      .populate('serviceId', 'name image')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: responses });
  } catch (error) {
    console.error("Responses API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
