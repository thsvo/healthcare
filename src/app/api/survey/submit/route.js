import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SurveyResponse from "@/models/SurveyResponse";
import User from "@/models/User";
import { sendWelcomeEmail, generatePassword } from "@/lib/email";

// POST submit survey
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { userInfo, answers } = body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userInfo.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please login instead." },
        { status: 400 }
      );
    }
    
    // Create survey response
    const surveyResponse = await SurveyResponse.create({
      userInfo,
      answers,
      status: "new",
    });
    
    // Generate random password
    const generatedPassword = generatePassword(10);
    
    // Create user account
    const newUser = await User.create({
      email: userInfo.email,
      password: generatedPassword,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      birthday: userInfo.birthday,
      sex: userInfo.sex,
      phone: userInfo.phone,
      company: userInfo.company,
      address: userInfo.address,
      addressLine2: userInfo.addressLine2,
      city: userInfo.city,
      state: userInfo.state,
      zipCode: userInfo.zipCode,
      surveyResponseId: surveyResponse._id,
      role: 'user',
    });
    
    // Link user to survey response
    surveyResponse.userId = newUser._id;
    await surveyResponse.save();
    
    // Send welcome email with credentials (async, non-blocking)
    sendWelcomeEmail(userInfo.email, userInfo.firstName, generatedPassword)
      .then((sent) => {
        if (sent) {
          console.log(`Welcome email sent to ${userInfo.email}`);
        } else {
          console.error(`Failed to send welcome email to ${userInfo.email}`);
        }
      })
      .catch((err) => {
        console.error(`Email error for ${userInfo.email}:`, err);
      });
    
    return NextResponse.json({
      success: true,
      data: {
        surveyResponse,
        message: "Survey submitted successfully! Check your email for login credentials.",
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error("Survey submission error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
