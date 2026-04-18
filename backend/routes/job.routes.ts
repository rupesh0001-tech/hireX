import express from "express";
import { getJobs, createJob } from "../controllers/job.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getJobs);
router.post("/", protectRoute, createJob);

export default router;
