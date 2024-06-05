import express from "express";
import {
  registerUser,
  checkEmail,
  checkPassword,
  userDetails,
  logout,
  updateUserDetails
} from "../controller/user.controller.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/check-email", checkEmail);
router.post("/login", checkPassword);
router.get("/user-details", userDetails);
router.get("/logout", logout);
router.put("/update-user",updateUserDetails)

export default router;
