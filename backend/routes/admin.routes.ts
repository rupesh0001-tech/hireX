import express from "express";
import { getUnverifiedCompanies, verifyCompany, getVerifiedCompanies } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/companies/unverified", getUnverifiedCompanies);
router.get("/companies/verified", getVerifiedCompanies);
router.put("/companies/:id/verify", verifyCompany);

export default router;
