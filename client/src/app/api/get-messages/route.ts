import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].ts/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export const GET = async (request: Request) => {
    await dbConnect()
    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if (!session || !session.user) {
            return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
        }
        const userId = new mongoose.Types.ObjectId(user._id)
        const newUser = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        if (!newUser || newUser.length === 0) {
            return Response.json({ success: false, message: "User not found" }, { status: 400 })
        }
        return Response.json({ success: true, messages: newUser[0].messages }, { status: 200 })
    } catch (error) {
        console.log("Error in get message : ", error)
        return Response.json({ success: false, message: "Error in get message route" }, { status: 500 })
    }
}