import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].ts/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { success } from "zod";
import { useReducer } from "react";

export const POST = async (request: Request) => {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Not Authencticated" },
            { status: 401 },
        );
    }
    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessages,
            },
            { new: true },
        );
        if (!updatedUser) {
            return Response.json({ success: false, message: "failed ot udpate user status to accpet messages" }, { status: 401 })
        }
        return Response.json({ success: true, message: "Message acceptance status updated successfully", updatedUser }, { status: 201 })
    } catch (error) {
        console.log("Error in accept messages : ", error);
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages",
        });
    }
};

export const GET = async (request: Request) => {
    await dbConnect()
    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if (!session || !session.user) {
            return Response.json({ success: false, message: "Not authencticated" }, { status: 401 })
        }
        const userId = user._id;
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 })
        }
        return Response.json({ success: true, isAcceptingMessages: foundUser.isAcceptingMessage }, { status: 200 })
    } catch (error) {
        console.log("Error in accept message : ", error)
        return Response.json({ success: false, message: "Error in getting accept messages" }, { status: 500 })
    }
}