import dbConnect from "../../../../../config/db";
import Chat from "../../../../../model/Chat";


import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { chatId, name } = await req.json();

        await dbConnect();
        await Chat.findOneAndUpdate(
            { _id: chatId, userId },
            { name },
            
        );

        return NextResponse.json(
            {
                message: "Chat renamed successfully",
                success: true,
                
            },
            
        );
    }
    catch (error) {
        console.error("❌ Error renaming chat:", error);
        return NextResponse.json(
            {
                message: "Error renaming chat",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}