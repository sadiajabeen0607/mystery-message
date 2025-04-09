import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  // console.log(" username", username);
  // console.log("content", content);
  

  try {
    const user = await UserModel.findOne({username});
    // console.log("user", user?.isAcceptingMessage);
    
    if (!user) {
      return Response.json(
        {
          success: true,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    if(!user.isAcceptingMessage) {
      return Response.json({
        success: false,
        message: "User is not accepting the messages"
      }, {status: 403})
    }

    const newMessage = {content, createdAt: new Date()};
    // console.log("new Message", newMessage);
    
    user.messages.push(newMessage as Message);
    await user.save({ validateBeforeSave: false});

    return Response.json({
      success: true,
      message: 'Message send successfully'
    }, { status: 200})

  } catch (error) {
    console.log("Fail to send messages", error);
    return Response.json({
      success: false,
      message: "Fail to send messages"
    }, { status: 500 })
  }
}
