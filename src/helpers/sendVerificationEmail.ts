import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email:string, username: string, verifyCode: string) : Promise<ApiResponse>{
  try {
    await resend.emails.send({
      from: 'noreply@mysterymessage.infy.uk',
      to: email,
      subject: 'Mystery Message | Verification Email',
      react: VerificationEmail({username, otp: verifyCode}),
    })
    return { success: true, message: 'Verification email send successfully'}

  } catch (emailError) {
    console.log(`Error sending verification code ${emailError}`);
    return { success: false, message: 'Failed to send verification email'}
    
  }
}