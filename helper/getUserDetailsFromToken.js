import jwt from "jsonwebtoken";
import User from "../models/user.Model.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "session Out",
      logout: true,
    };
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decode.id).select("-password");
    return user;
  } catch (error) {
    console.error("Error decoding token:", error.message); // Log detailed error message
    throw error;
  }
};

export default getUserDetailsFromToken;
