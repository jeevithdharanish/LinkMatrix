import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

/**
 * Mongoose connection caching for API routes and server components
 */
let mongooseCache = global.mongoose;

if (!mongooseCache) {
  mongooseCache = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    mongooseCache.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
  } catch (e) {
    mongooseCache.promise = null;
    throw e;
  }

  return mongooseCache.conn;
}

/**
 * Native MongoDB client for NextAuth adapter
 * This is separate from Mongoose and required by @auth/mongodb-adapter
 */
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve across HMR
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGO_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(MONGO_URI);
  clientPromise = client.connect();
}

// Default export for NextAuth adapter compatibility
export default clientPromise;