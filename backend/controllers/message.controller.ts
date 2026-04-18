import { Request, Response } from "express";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

// Send a message
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { receiverId, message } = req.body;
    // @ts-ignore
    const senderId = req.user.userId;

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error: any) {
    console.error("Error in sendMessage", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get messages for a specific conversation
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otherUserId } = req.params;
    // @ts-ignore
    const userId = req.user.userId;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error: any) {
    console.error("Error in getMessages", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get list of users user has chatted with
export const getConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.userId;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    const userIds = new Set();
    messages.forEach((msg) => {
      userIds.add(msg.senderId.toString());
      userIds.add(msg.receiverId.toString());
    });
    userIds.delete(userId.toString());

    const conversations = await User.find({ _id: { $in: Array.from(userIds) } }).select("name companyName role");

    res.status(200).json(conversations);
  } catch (error: any) {
    console.error("Error in getConversations", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
