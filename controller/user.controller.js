import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/user.Model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import getUserDetailsFromToken from "../helper/getUserDetailsFromToken.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, profile_pic } = req.body;
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        message: "User Already Exists",
        error: true,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      profile_pic,
      password: hashPassword,
    };
    const user = new User(payload);
    const userSave = await user.save();
    return res.status(201).json({
      message: "User created successfully",
      data: userSave,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
});

const checkEmail = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmail = await User.findOne({ email }).select("-password");
    if (!checkEmail) {
      return res.status(400).json({
        message: "User not exist",
        error: true,
      });
    }
    return res.status(200).json({
      message: "email verified",
      success: true,
      data: checkEmail,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
});

const checkPassword = asyncHandler(async (req, res) => {
  try {
    const { password, userId } = req.body;
    const user = await User.findById(userId);
    const varifyPassWord = await bcryptjs.compare(password, user.password);
    if (!varifyPassWord) {
      return res.status(400).json({
        message: "please check password",
        error: true,
      });
    }
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    const cookiesOptions = {
      http: true,
      secure: true,
    };
    return res.status(201).json({
      message: "Login SuccessFully",

      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
});

const userDetails = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsFromToken(token);

    return res.json({
      message: "user details",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    const cookiesOptions = {
      http: true,
      secure: true,
    };
    return res.cookie("token", "", cookiesOptions).status(200).json({
      message: "session out,logout",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
});

const updateUserDetails = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsFromToken(token);
    const { name, profile_pic } = req.body;
    const updateUser = await User.updateOne(
      { _id: user._id },
      {
        name,
        profile_pic,
      }
    );
    const userInformation = await User.findById(user._id);
    return res.status(200).json({
      message: "user updated successfully",
      data: userInformation,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
});

const serachUser = asyncHandler(async (req, res) => {
  try {
    const { search } = req.body;
    const query = new RegExp(search, "i", "g");
    const user = await User.find({
      $or: [{ name: query }, { email: query }],
    }).select("-password");
    return res.status(200).json({
      message: "all User",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
});

export {
  registerUser,
  checkEmail,
  checkPassword,
  userDetails,
  logout,
  updateUserDetails,
  serachUser,
};
