import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  // console.log("session:", session);

  if (!session || !session?.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(session.user._id);

  try {
    // ✅ Step 1: Check if user exists
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Step 2: Use aggregation pipeline
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } }, // Prevents error if messages are empty
      { $sort: { "messages.createdAt": -1 } }, // ✅ Fixed typo
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    // console.log("User after aggregation:", user);

    // ✅ Step 3: Check if messages exist
    if (!user.length || !user[0].messages.length) {
      return Response.json(
        { success: false, message: "No messages available" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getting messages:", error);
    return Response.json(
      { success: false, message: "Error in getting messages" },
      { status: 500 }
    );
  }
}
