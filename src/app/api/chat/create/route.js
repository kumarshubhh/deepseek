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

        const chatData = {
            name: "New Chat",
            messages: [],
            userId: userId,
        }

        await dbConnect();
        await Chat.create(chatData);
        return NextResponse.json(
            {
                message: "Chat created successfully",
                chatData,
            },
            {
                status: 201,
            }
        );
       
      
    } catch (error) {
        console.error("❌ Error creating chat:", error);
        return NextResponse.json(
            {
                message: "Error creating chat",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
    

