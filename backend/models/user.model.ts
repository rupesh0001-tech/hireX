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
    bio: {
      type: String,
      default: "",
    },
    profession: {
      type: String,
      default: "",
    },
    faceDescriptor: {
      type: [Number], // Storing the face embedding array directly
      default: [],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
