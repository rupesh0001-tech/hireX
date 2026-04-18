import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (
  name: string,
  email: string,
  passwordHash: string,
  dob: Date,
  age: number,
  bio: string,
  profession: string,
  faceDescriptor: number[]
) => {
  const newUser = new User({
    name,
    email,
    password: passwordHash,
    dob,
    age,
    bio,
    profession,
    faceDescriptor,
  });

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
