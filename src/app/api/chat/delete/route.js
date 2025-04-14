import dbConnect from "../../../../../config/db";
import Chat from "../../../../../model/Chat";


import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req) {

    try {
        const { userId } = getAuth(req);
        const { chatId } = await req.json();
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

       
        await dbConnect();
        await Chat.deleteOne({ _id: chatId, userId });

        return NextResponse.json(
            {
                message: "Chat deleted successfully",
                success: true,
            },

        );
    }
    catch (error) {
        console.error("❌ Error deleting chat:", error);
        return NextResponse.json(
            {
                message: "Error deleting chat",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }

    
}
