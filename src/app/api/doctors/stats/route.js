import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SurveyResponse from "@/models/SurveyResponse";

export async function GET() {
  try {
    await dbConnect();
    
    // In a production app with many thousands of records, aggregation pipelines would be more efficient.
    // For now, simpler separate queries or parallel execution is easier to read and maintain for moderate scale.
    
    // Get all doctors first
    const doctors = await User.find({ role: 'doctor' }).select('_id firstName lastName email');
    
    // Calculate stats for each doctor
    const stats = await Promise.all(doctors.map(async (doc) => {
      const patientCount = await User.countDocuments({ 
        role: 'user', 
        assignedDoctorId: doc._id 
      });
      
      const surveyCount = await SurveyResponse.countDocuments({ 
        assignedDoctor: doc._id,
        // Optional: filter by active status if needed? User request implied "tasks"
        // Let's count all pending/reviewed/active ones, maybe exclude archived?
        // keeping it simple: all assigned
      });

      // Get breakdown of survey status for more detail "which task"
      const pendingSurveys = await SurveyResponse.countDocuments({
        assignedDoctor: doc._id,
        status: 'new' // or 'reviewed' depending on workflow
      });
      
      return {
        _id: doc._id,
        patientCount,
        surveyCount,
        pendingSurveys
      };
    }));
    
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching doctor stats:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
