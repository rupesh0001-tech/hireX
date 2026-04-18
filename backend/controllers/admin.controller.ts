import { Request, Response } from "express";
import { User } from "../models/user.model.js";

// Get all users who registered as a company but are not verified yet
export const getUnverifiedCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const unverifiedCompanies = await User.find({
      role: "company",
      isVerified: false,
    }).select("-password");

    res.status(200).json(unverifiedCompanies);
  } catch (error: any) {
    console.error("Error in getUnverifiedCompanies controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Verify a specific company user
export const verifyCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const company = await User.findOneAndUpdate(
      { _id: id, role: "company" },
      { isVerified: true },
      { new: true }
    ).select("-password");

    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    res.status(200).json({ message: "Company verified successfully", company });
  } catch (error: any) {
    console.error("Error in verifyCompany controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all verified companies
export const getVerifiedCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const verifiedCompanies = await User.find({
      role: "company",
      isVerified: true,
    }).select("-password");

    res.status(200).json(verifiedCompanies);
  } catch (error: any) {
    console.error("Error in getVerifiedCompanies controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
