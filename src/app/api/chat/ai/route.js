export const maxDuration = 60;

import OpenAI from "openai";
import dbConnect from "../../../../../config/db";
import Chat from "../../../../../model/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        const { chatId, prompt } = await req.json();

        console.log("🧾 Incoming Request =>", { userId, chatId, prompt });

        if (!userId) {
            console.log("❌ Unauthorized user");
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        console.log("✅ Database connected");

        const data = await Chat.findOne({ _id: chatId, userId });
        if (!data) {
            console.log("❌ Chat not found");
            return NextResponse.json(
                { message: "Chat not found" },
                { status: 404 }
            );
        }

        const userPrompt = {
            role: "user",
            content: prompt,
            timestamps: Date.now(),
        };

        data.messages.push(userPrompt);

        console.log("📤 Sending to DeepSeek:", {
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
        });

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
            store: true,
        });

        const message = completion.choices[0].message;
        message.timestamps = Date.now();

        data.messages.push(message);
        await data.save();

        console.log("✅ AI Response received:", message);

        return NextResponse.json(
            {
                message: "Chat response received",
                data: message,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("❌ Error in chat API:", error);
        return NextResponse.json(
            {
                message: "Error in chat API",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
