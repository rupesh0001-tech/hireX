import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["common", "company"],
      default: "common",
      required: true,
    },
    currentPosition: {
      type: String,
      default: "", // student, freelancer, employed, owner, etc.
    },
    education: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    // Company specific fields
    companyName: {
      type: String,
      default: "",
    },
    companyInfo: {
      type: String,
      default: "",
    },
    companyOwnershipDocs: {
      type: String,
      default: "", // URL or path to doc
    },
    isVerified: {
      type: Boolean,
      default: false, // For admin panel verification
    },
    faceDescriptor: {
      type: [Number], // Storing the face embedding array directly
      default: [],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
