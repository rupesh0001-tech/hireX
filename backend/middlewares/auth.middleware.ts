import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protectRoute = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ error: "Unauthorized - No Token Provided" });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

    if (!decoded) {
      res.status(401).json({ error: "Unauthorized - Invalid Token" });
      return;
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
