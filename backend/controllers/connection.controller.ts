import { Request, Response } from "express";
import { Connection } from "../models/connection.model.js";
import { User } from "../models/user.model.js";

// Send connection request
export const sendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipientId } = req.body;
    // @ts-ignore
    const userId = req.user.userId;

    if (recipientId === userId) {
      res.status(400).json({ error: "You cannot connect with yourself" });
      return;
    }

    const existing = await Connection.findOne({
      $or: [
        { requesterId: userId, recipientId },
        { requesterId: recipientId, recipientId: userId }
      ]
    });

    if (existing) {
      res.status(400).json({ error: "Connection request already exists or you are already connected" });
      return;
    }

    const connection = new Connection({
      requesterId: userId,
      recipientId,
    });

    await connection.save();
    res.status(201).json(connection);
  } catch (error: any) {
    console.error("Error in sendRequest", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Accept/Decline connection request
export const updateRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'declined'
    // @ts-ignore
    const userId = req.user.userId;

    const connection = await Connection.findOne({ _id: id, recipientId: userId });

    if (!connection) {
       res.status(404).json({ error: "Request not found or you are not the recipient" });
       return;
    }

    connection.status = status;
    await connection.save();

    res.status(200).json(connection);
  } catch (error: any) {
    console.error("Error in updateRequestStatus", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user's connections
export const getConnections = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.userId;

    const connections = await Connection.find({
      $or: [
        { requesterId: userId, status: "accepted" },
        { recipientId: userId, status: "accepted" }
      ]
    }).populate("requesterId recipientId", "name companyName role bio");

    res.status(200).json(connections);
  } catch (error: any) {
    console.error("Error in getConnections", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get pending requests
export const getPendingRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.userId;

    const requests = await Connection.find({ recipientId: userId, status: "pending" })
      .populate("requesterId", "name companyName role bio");

    res.status(200).json(requests);
  } catch (error: any) {
    console.error("Error in getPendingRequests", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
