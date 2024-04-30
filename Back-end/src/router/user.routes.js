import { Router } from "express";
import { changeCurrentPassword, loginUser, registerUser, updateProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/Auth.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/update-profile").post(verifyJWT,updateProfile)

export default router