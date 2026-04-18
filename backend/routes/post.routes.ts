import express from "express";
import { createPost, getFeed, toggleLike, addComment } from "../controllers/post.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeed);
router.post("/create", protectRoute, createPost);
router.post("/:id/like", protectRoute, toggleLike);
router.post("/:id/comment", protectRoute, addComment);

export default router;
