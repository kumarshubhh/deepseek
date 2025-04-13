import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("🌐 Connecting to MongoDB Atlas...");
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully!");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

