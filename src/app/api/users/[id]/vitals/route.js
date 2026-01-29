import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Vitals from "@/models/Vitals";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET vitals for a user
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // Get the latest vitals with full history
    const vitals = await Vitals.findOne({ userId: id })
      .populate('createdBy', 'firstName lastName role')
      .populate('updatedBy', 'firstName lastName role')
      .populate('changeHistory.changedBy', 'firstName lastName role')
      .sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, data: vitals });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create or update vitals
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Get current user from token
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    let currentUserId = null;

    if (token?.value) {
      try {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "default_secret");
        currentUserId = decoded.userId;
      } catch (e) {
        console.error("Token verification error:", e);
      }
    }

    // Check if vitals already exist for this user
    const existingVitals = await Vitals.findOne({ userId: id });

    if (existingVitals) {
      // Track changes
      const changeHistory = [];
      const fields = [
        'weightLbs', 'weightOz', 'heightFt', 'heightIn', 'temperature', 'bmi',
        'bloodPressureSystolic', 'bloodPressureDiastolic', 'respiratoryRate',
        'pulse', 'bloodSugar', 'fasting', 'o2Saturation', 'notes'
      ];

      fields.forEach(field => {
        const oldValue = existingVitals[field] || '';
        const newValue = body[field] || '';

        if (oldValue !== newValue) {
          changeHistory.push({
            field,
            oldValue,
            newValue,
            changedBy: currentUserId,
            changedAt: new Date(),
          });
        }
      });

      // Update vitals
      existingVitals.weightLbs = body.weightLbs || '';
      existingVitals.weightOz = body.weightOz || '';
      existingVitals.heightFt = body.heightFt || '';
      existingVitals.heightIn = body.heightIn || '';
      existingVitals.temperature = body.temperature || '';
      existingVitals.bmi = body.bmi || '';
      existingVitals.bloodPressureSystolic = body.bloodPressureSystolic || '';
      existingVitals.bloodPressureDiastolic = body.bloodPressureDiastolic || '';
      existingVitals.respiratoryRate = body.respiratoryRate || '';
      existingVitals.pulse = body.pulse || '';
      existingVitals.bloodSugar = body.bloodSugar || '';
      existingVitals.fasting = body.fasting || '';
      existingVitals.o2Saturation = body.o2Saturation || '';
      existingVitals.notes = body.notes || '';
      existingVitals.updatedBy = currentUserId;

      // Add change history
      if (changeHistory.length > 0) {
        existingVitals.changeHistory.push(...changeHistory);
      }

      await existingVitals.save();

      // Update user profile height and weight
      await User.findByIdAndUpdate(id, {
        height: body.heightFt && body.heightIn ? `${body.heightFt}'${body.heightIn}"` : '',
        weight: body.weightLbs && body.weightOz ? `${body.weightLbs}lbs ${body.weightOz}oz` : (body.weightLbs ? `${body.weightLbs}lbs` : ''),
      });

      const populatedVitals = await Vitals.findById(existingVitals._id)
        .populate('createdBy', 'firstName lastName role')
        .populate('updatedBy', 'firstName lastName role')
        .populate('changeHistory.changedBy', 'firstName lastName role');

      return NextResponse.json({ success: true, data: populatedVitals });
    } else {
      // Create new vitals
      const vitals = await Vitals.create({
        userId: id,
        weightLbs: body.weightLbs || '',
        weightOz: body.weightOz || '',
        heightFt: body.heightFt || '',
        heightIn: body.heightIn || '',
        temperature: body.temperature || '',
        bmi: body.bmi || '',
        bloodPressureSystolic: body.bloodPressureSystolic || '',
        bloodPressureDiastolic: body.bloodPressureDiastolic || '',
        respiratoryRate: body.respiratoryRate || '',
        pulse: body.pulse || '',
        bloodSugar: body.bloodSugar || '',
        fasting: body.fasting || '',
        o2Saturation: body.o2Saturation || '',
        notes: body.notes || '',
        createdBy: currentUserId,
        updatedBy: currentUserId,
      });

      // Update user profile height and weight
      await User.findByIdAndUpdate(id, {
        height: body.heightFt && body.heightIn ? `${body.heightFt}'${body.heightIn}"` : '',
        weight: body.weightLbs && body.weightOz ? `${body.weightLbs}lbs ${body.weightOz}oz` : (body.weightLbs ? `${body.weightLbs}lbs` : ''),
      });

      const populatedVitals = await Vitals.findById(vitals._id)
        .populate('createdBy', 'firstName lastName role')
        .populate('updatedBy', 'firstName lastName role');

      return NextResponse.json({ success: true, data: populatedVitals });
    }
  } catch (error) {
    console.error("Vitals save error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
