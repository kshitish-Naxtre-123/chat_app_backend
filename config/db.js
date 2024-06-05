import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connect with mongodb database");
  } catch (error) {
    console.log(`connection failed:${error.message}`);
    process.exit(1);
  }
};

export default connectDB
