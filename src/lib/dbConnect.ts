import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to Database");
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    connection.isConnected = db.connections[0].readyState;
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed", error);
    process.exit(1);
  }
}

export default dbConnect;
