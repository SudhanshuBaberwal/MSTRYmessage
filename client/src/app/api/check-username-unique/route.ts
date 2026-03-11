import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signupSchema";
import { z } from "zod";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export const GET = async (request: Request) => {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // Validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        // console.log(result)
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid query parameter"
            }, { status: 400 })
        }
        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        if (existingVerifiedUser) {
            return Response.json({ success: false, message: "Username is already taken" }, { status: 400 })
        }
        return Response.json({ success: true, message: "Usename is unique" }, { status: 201 })
    } catch (error) {
        console.log("Error in check username unique controller :", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}