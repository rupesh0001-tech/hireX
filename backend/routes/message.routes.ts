import express from "express";
import { sendMessage, getMessages, getConversations } from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/send", protectRoute, sendMessage);

export default router;
