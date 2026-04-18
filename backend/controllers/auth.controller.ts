import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import * as authService from "../services/auth.service.js";
import { generateTokenAndSetCookie } from "../utils/token.js";

// Helper for facial recognition
function euclideanDistance(desc1: number[], desc2: number[]): number {
  if (desc1.length !== desc2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    sum += Math.pow(desc1[i] - desc2[i], 2);
  }
  return Math.sqrt(sum);
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, dob, age, bio, profession, faceDescriptor } = req.body;

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: "Email already taken" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await authService.registerUser(
      name,
      email,
      hashedPassword,
      dob ? new Date(dob) : new Date(),
      age || 0,
      bio || "",
      profession || "",
      faceDescriptor || []
    );

    generateTokenAndSetCookie(newUser._id.toString(), res);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error: any) {
    console.log("Error in register controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await authService.findUserByEmail(email);
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    generateTokenAndSetCookie(user._id.toString(), res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.log("Error in loginPassword controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginFace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, faceDescriptor } = req.body;
    
    if (!email || !faceDescriptor) {
      res.status(400).json({ error: "Email and face descriptor are required" });
      return;
    }

    const user = await authService.findUserByEmail(email);

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    if (!user.faceDescriptor || user.faceDescriptor.length === 0) {
      res.status(400).json({ error: "No face data registered for this user" });
      return;
    }

    const distance = euclideanDistance(faceDescriptor, user.faceDescriptor);

    const THRESHOLD = 0.5; // From standard face-api.js accuracy tuning

    if (distance > THRESHOLD) {
      res.status(401).json({ error: "Face does not match. Please try again." });
      return;
    }

    generateTokenAndSetCookie(user._id.toString(), res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.log("Error in loginFace controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const user = await authService.findUserById(req.user.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.log("Error in getProfile controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    let updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }
    // @ts-ignore
    const updatedUser = await authService.updateUserProfile(req.user.userId, updates);

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
