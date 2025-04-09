import { NextResponse } from 'next/server';  // Use NextResponse for API response in newer versions of Next.js
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
  // Await the params
  const { messageid } = await params; // This line is important to await the dynamic parameters

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session?.user) {
    return NextResponse.json({
      success: false,
      message: "Not authenticated"
    }, { status: 401 });
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return NextResponse.json({
        success: false,
        message: "Message not found or already deleted"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully"
    }, { status: 200 });

  } catch (error) {
    console.log("Error in delete message route", error);
    return NextResponse.json({
      success: false,
      message: "Error deleting message"
    }, { status: 500 });
  }
}
