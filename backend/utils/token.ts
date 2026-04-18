import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { Response } from "express";

export const generateTokenAndSetCookie = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevent XSS attacks
    sameSite: "strict", // prevent CSRF attacks
    secure: config.nodeEnv !== "development",
  });

  return token;
};
