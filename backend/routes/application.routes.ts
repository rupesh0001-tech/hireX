import express from "express";
import { applyForJob, getJobApplications, updateStatus } from "../controllers/application.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/apply", protectRoute, applyForJob);
router.get("/job/:jobId", protectRoute, getJobApplications);
router.put("/:id/status", protectRoute, updateStatus);

export default router;
