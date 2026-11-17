import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Debugging ke liye hum print karenge ki Node ko kya mil raha hai
    console.log("Checking MONGO_URI:", process.env.MONGO_URI);

    // Fallback: Agar .env fail ho jaye, toh direct string use karo
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/lms-project';

    const conn = await mongoose.connect(uri);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;