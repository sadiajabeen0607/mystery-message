import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    // console.log("username", username);
    // console.log("code", code);

    const decodedUser = decodeURIComponent(username);
    // console.log("decodedUser", decodedUser);

    const user = await UserModel.findOne({ username: decodedUser });
    console.log("user", user);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });

      return Response.json(
        {
          success: true,
          message: "Account verified Successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has been expired. Please SignUp again to get a code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid Verification code.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying User",
      },
      { status: 500 }
    );
  }
}
