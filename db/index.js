// import mongoose from 'mongoose';

// const dbName = process.env.MONGODB_DB;
// const MONGODB_URI = process.env.MONGODB_URI;

// let cached = global.mongoose || { conn: null, promise: null };

// const connectDb = async () => {
//   if (cached.conn) return cached.conn;

//   if (!MONGODB_URI) {
//     throw new Error('MONGODB_URI is missing');
//   }

//   cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
//     dbName,
//     bufferCommands: false,
//   });

//   cached.conn = await cached.promise;

//   return cached.conn;
// };

// export { connectDb };

import mongoose from 'mongoose';

// Load environment variables
const env = process.env.NODE_ENV || 'development';
const dbName = process.env.MONGODB_DB;

// Use different URIs based on the environment
const MONGODB_URI =
  env === 'production'
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI_LOCAL;

let cached = global.mongoose || { conn: null, promise: null };

const connectDb = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName,
    bufferCommands: false,
  });

  cached.conn = await cached.promise;

  return cached.conn;
};

export { connectDb };