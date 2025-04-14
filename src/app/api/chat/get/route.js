import dbConnect from "../../../../../config/db";
import Chat from "../../../../../model/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const data = await Chat.find({ userId });

        console.log("Chats fetched for user:", data);  // Add log here

        return NextResponse.json(
            {
                message: "Chats fetched successfully",
                data,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("❌ Error fetching chats:", error);
        return NextResponse.json(
            {
                message: "Error fetching chats",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
