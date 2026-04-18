import { Request, Response } from "express";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Apply for a job
export const applyForJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId, resumeUrl, coverLetter, resumeBase64 } = req.body;
    // @ts-ignore
    const userId = req.user.userId;

    // Check if already applied
    const existing = await Application.findOne({ jobId, candidateId: userId });
    if (existing) {
      res.status(400).json({ error: "You have already applied for this job" });
      return;
    }

    let finalResumeUrl = resumeUrl || "";

    if (resumeBase64) {
      try {
        const formData = new FormData();
        formData.append("file", resumeBase64);
        formData.append("fileName", `resume_${userId}_${jobId}.pdf`);

        const authHeader = "Basic " + Buffer.from(process.env.IMAGE_KIT_PRIVATE + ":").toString("base64");

        const ikRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          headers: {
            "Authorization": authHeader,
          },
          body: formData,
        });

        if (ikRes.ok) {
          const ikData = await ikRes.json();
          finalResumeUrl = ikData.url;
        }
      } catch (err) {
        console.error("Resume upload failed", err);
      }
    }

    const application = new Application({
      jobId,
      candidateId: userId,
      resumeUrl: finalResumeUrl,
      coverLetter,
    });

    await application.save();
    res.status(201).json(application);
  } catch (error: any) {
    console.error("Error in applyForJob", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all applications for a company's job
export const getJobApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    // @ts-ignore
    const userId = req.user.userId;

    const job = await Job.findById(jobId);
    if (!job || job.companyId.toString() !== userId) {
      res.status(403).json({ error: "Unauthorized access to these applications" });
      return;
    }

    const applications = await Application.find({ jobId })
      .populate("candidateId", "name email currentPosition education bio")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error: any) {
    console.error("Error in getJobApplications", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update application status
export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // @ts-ignore
    const userId = req.user.userId;

    const app = await Application.findById(id).populate("jobId");
    if (!app) {
       res.status(404).json({ error: "Application not found" });
       return;
    }

    // @ts-ignore
    if (app.jobId.companyId.toString() !== userId) {
       res.status(403).json({ error: "Unauthorized" });
       return;
    }

    app.status = status;
    await app.save();

    res.status(200).json(app);
  } catch (error: any) {
    console.error("Error in updateStatus", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
