import jwt from "jsonwebtoken";
import User from "../models/user.Model.js";

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "session Out",
      logout: true,
    };
  }
  const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decode.id).select("-password");
  return user;
};

export default getUserDetailsFromToken
