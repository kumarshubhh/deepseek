import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export default async function dbConnect() {
  // If a cached connection exists, return it
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  // If no cached connection, start a new connection
  if (!cached.promise) {
    console.log("🌐 Connecting to MongoDB Atlas...");
    
    // Set the connection promise
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false, // Disable use of findAndModify
        useCreateIndex: true, // Use createIndex instead of ensureIndex
      })
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully!");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        throw err; // Throw error to be handled later
      });
  }

  // Cache the connection once established
  cached.conn = await cached.promise;
  return cached.conn;
}
