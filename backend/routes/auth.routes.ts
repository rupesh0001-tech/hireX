import express from "express";
import { register, loginPassword, loginFace, logout, getProfile, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login-password", loginPassword);
router.post("/login-face", loginFace);
router.post("/logout", logout);
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, updateProfile);

export default router;
