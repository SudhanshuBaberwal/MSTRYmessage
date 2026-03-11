import { sendVerificationEmail } from "@/helpers/sendVerficationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

export const POST = async (request: Request) => {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserVerifiedByUsername) {
            return Response.json({ success: false, message: "Username is already taken" }, { status: 400 })
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        const existingUserByEmail = await UserModel.findOne({ email })
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({ success: false, message: "User already exist with this email" }, { status: 400 })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 100)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }
        // Send Verification Email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        if (!emailResponse.success) {
            return Response.json({ success: false, message: emailResponse.message }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User registered successfully , Please Verify your email"
        }, { status: 201 })
    } catch (error) {
        console.log("Error in signup route : ", error)
        return Response.json({ success: false, message: "Error in Signup" }, { status: 500 })
    }
}