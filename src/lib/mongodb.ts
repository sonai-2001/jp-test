import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase(): Promise<void> {
  if (isConnected) {
    console.log("Already connected to the database");
    return;
  }

  // Check for MONGODB_URI
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    // Add connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;  // Reset flag when disconnected
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;  // Reset flag on error
    });

    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    isConnected = false;  // Ensure flag is false if connection fails
    throw new Error("Database connection failed");
  }
}