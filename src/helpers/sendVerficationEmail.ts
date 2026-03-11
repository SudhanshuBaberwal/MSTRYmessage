import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationsEmails";
import { ApiResponse } from "@/types/ApiResponse";
import { any } from "zod";
import { url } from "inspector";

export const sendVerificationEmail = async (email: string, username: string, verifyCode: string): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: "24bcs147@iiitdwd.ac.in",
            to: email,
            subject: "Mystry message | Verification code",
            react: VerificationEmail({ username, otp: verifyCode })
        })
        return { success: true, message: "Verification Email send successfully" }
    } catch (emailError) {
        console.log("Error in sending verification email : ", emailError)
        return { success: false, message: "Failed to send verification email" }
    }
}