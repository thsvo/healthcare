import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SurveyResponse from "@/models/SurveyResponse";
import User from "@/models/User";
import { sendWelcomeEmail, generatePassword } from "@/lib/email";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// POST submit survey
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { userInfo, answers, serviceId } = body;
    
    // Check if user is logged in via token
    let loggedInUser = null;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        loggedInUser = await User.findById(decoded.userId);
      } catch (e) {
        // Invalid token, proceed as guest
      }
    }
    
    let user = loggedInUser;
    let isNewUser = false;
    
    // If not logged in, check if user exists by email
    if (!user && userInfo?.email) {
      user = await User.findOne({ email: userInfo.email });
      
      // If user doesn't exist, create new account
      if (!user) {
        const generatedPassword = generatePassword(10);
        
        user = await User.create({
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
          role: 'user',
        });
        
        isNewUser = true;
        
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
      }
    }
    
    // Create survey response with serviceId
    const surveyResponse = await SurveyResponse.create({
      userInfo: loggedInUser ? {
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        email: loggedInUser.email,
        phone: loggedInUser.phone,
        birthday: loggedInUser.birthday,
        sex: loggedInUser.sex,
        company: loggedInUser.company,
        address: loggedInUser.address,
        addressLine2: loggedInUser.addressLine2,
        city: loggedInUser.city,
        state: loggedInUser.state,
        zipCode: loggedInUser.zipCode,
      } : userInfo,
      answers,
      status: "new",
      userId: user?._id,
      serviceId: serviceId || null,
    });
    
    // Update user's first surveyResponseId if new user
    if (isNewUser && user) {
      user.surveyResponseId = surveyResponse._id;
      await user.save();
    }
    
    return NextResponse.json({
      success: true,
      data: {
        surveyResponse,
        isNewUser,
        message: isNewUser 
          ? "Survey submitted successfully! Check your email for login credentials."
          : "Survey submitted successfully!",
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
