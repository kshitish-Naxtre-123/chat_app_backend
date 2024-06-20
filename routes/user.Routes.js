import express from "express";
import {
  registerUser,
  checkEmail,
  checkPassword,
  userDetails,
  logout,
  updateUserDetails,
  serachUser
} from "../controller/user.controller.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/check-email", checkEmail);
router.post("/login", checkPassword);
router.get("/user-details/:token", userDetails);
router.get("/logout", logout);
router.put("/update-user/:token",updateUserDetails)
router.post("/search-user",serachUser)


export default router;
