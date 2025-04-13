import { Webhook} from "svix";
import connectDb from "../../../../config/db";

import User from "../../../../model/User";
import { headers } from "next/headers";

import { NextResponse } from "next/server";

export async function POST(req) {
 try{  console.log("🔥 Webhook hit");
    
    const wh = new Webhook(process.env.SIGNING_SECRET);
    const headerPayload = await headers();
    const svixHeader = {
        "svix-id": headerPayload.get("svix-id"),
        "svix-timestamp": headerPayload.get("svix-timestamp"),
        
        
        "svix-signature": headerPayload.get("svix-signature"),
    };

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const {data, type} = wh.verify(body, svixHeader);

    const userData ={
        _id: data.id,
       email: data.email_addresses[0].email_address ,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
    };
    await connectDb();
    console.log("✅ MongoDB Connected");

    switch (type) {
        case "user.created":
            await User.create(userData);
            console.log("✅ User created");
            break;
        case "user.updated":
             await User.findByIdAndUpdate(data.id, userData)
            break;
            case "user.deleted":
            await User.findByIdAndDelete(data.id)
            console.log("❌ User deleted");
            break;
        default:
            break;
    }
    return NextResponse.json({
        message: "Webhook received",
    }, {
        status: 200,
    } )

}catch (error) {
    return NextResponse.json({
        message: "Webhook error",
        error: error.message,
    }, {
        status: 500,
    })
}
}
