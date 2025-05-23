import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserByVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserByVerifiedUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {

      if(existingUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User already exist with this email",
        }, {status: 400});
      } else {
        existingUserByEmail.password = password;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }

    } else {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    console.log("emailResponse", emailResponse);
    

    if(!emailResponse || !emailResponse.success) {
      return Response.json({
        success: false,
        message: emailResponse?.message || "Failed to send verification email",
      }, {status: 500});
    }

    return Response.json({
      success: true,
      message: "User registered successfully. Please verify your email.",
    }, {status: 201});
  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: error || "Error registering User",
      },
      {
        status: 500,
      }
    );
  }
}
