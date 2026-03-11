import mongoose from "mongoose";

// Load environment variables
// const env = process.env.NODE_ENV || "development";
const dbName = process.env.MONGODB_DB;

// Use different URIs based on the environment
const MONGODB_URI = process.env.MONGODB_URI;

// env === "production"
//   ? process.env.MONGODB_URI
//   : process.env.MONGODB_URI_LOCAL;

let cached = global.mongoose || { conn: null, promise: null };

const connectDb = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  const connect = async (uri) =>
    mongoose.connect(uri, {
      dbName,
      bufferCommands: false,
    });

  try {
    cached.promise = cached.promise || connect(MONGODB_URI);
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // If local Mongo isn't running, try the production URI (if configured).
    if (error?.message?.includes("ECONNREFUSED") && process.env.MONGODB_URI) {
      cached.promise = cached.promise || connect(process.env.MONGODB_URI);
      cached.conn = await cached.promise;
      return cached.conn;
    }

    throw error;
  }
};

export { connectDb };
