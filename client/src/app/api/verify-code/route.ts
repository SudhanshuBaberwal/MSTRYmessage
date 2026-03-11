import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { success } from "zod";


export const POST = async (request: Request) => {
    await dbConnect()
    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
            return Response.json({ success: false, message: "User not found" })
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({ success: true, message: "Accound Verified Successfully" })
        }
        else if (!isCodeNotExpired) {
            return Response.json({ success: false, message: "Verification code has expired, please signup again to get new code" } , {status:402})
        }
        else{
            return Response.json({success : false , message : "Incorrect verification code"})
        }
    } catch (error) {
        console.log("Error in verify code : ", error)
        return Response.json({ success: false, message: "Error in verify code" })
    }
}