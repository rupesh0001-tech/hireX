import express from "express";
import { sendRequest, updateRequestStatus, getConnections, getPendingRequests } from "../controllers/connection.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getConnections);
router.get("/pending", protectRoute, getPendingRequests);
router.post("/request", protectRoute, sendRequest);
router.put("/:id/status", protectRoute, updateRequestStatus);

export default router;
