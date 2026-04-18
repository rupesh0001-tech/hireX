import { Request, Response } from "express";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// Fetch all open jobs (public)
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ status: "open" }).populate("companyId", "companyName email companyInfo");
    res.status(200).json(jobs);
  } catch (error: any) {
    console.error("Error in getJobs controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new job (Protected: Verified Companies Only)
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, location, salary } = req.body;
    // @ts-ignore
    const userId = req.user.userId;

    // Verify the user is a company and is verified
    const company = await User.findById(userId);

    if (!company || company.role !== "company") {
      res.status(403).json({ error: "Access denied. Only companies can post jobs." });
      return;
    }

    if (!company.isVerified) {
      res.status(403).json({ error: "Your company is not verified yet. Please wait for admin approval before posting jobs." });
      return;
    }

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId: userId,
    });

    await newJob.save();
    
    res.status(201).json(newJob);
  } catch (error: any) {
    console.error("Error in createJob controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
