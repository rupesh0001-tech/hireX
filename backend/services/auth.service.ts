import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (userData: any) => {
  const newUser = new User(userData);
  return await newUser.save();
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findUserById = async (id: string) => {
  return await User.findById(id).select("-password");
};

export const updateUserProfile = async (id: string, updates: any) => {
  return await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
};
