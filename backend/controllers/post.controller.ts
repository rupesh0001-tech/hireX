import { Request, Response } from "express";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

// Create a new post
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, mediaUrl, mediaBase64 } = req.body;
    // @ts-ignore
    const userId = req.user.userId;

    let finalMediaUrl = mediaUrl || "";

    // ImageKit upload logic if base64 is provided
    if (mediaBase64) {
      try {
        const formData = new FormData();
        formData.append("file", mediaBase64);
        formData.append("fileName", `post_${userId}_${Date.now()}.png`);

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
          finalMediaUrl = ikData.url;
        }
      } catch (err) {
        console.error("Post media upload failed:", err);
      }
    }

    const newPost = new Post({
      authorId: userId,
      content,
      mediaUrl: finalMediaUrl,
    });

    await newPost.save();
    
    // Populate author info for immediate UI update
    const populatedPost = await Post.findById(newPost._id).populate("authorId", "name companyName role isVerified");

    res.status(201).json(populatedPost);
  } catch (error: any) {
    console.error("Error in createPost", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all posts for home feed
export const getFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find()
      .populate("authorId", "name companyName role isVerified")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error: any) {
    console.error("Error in getFeed", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Like/Unlike a post
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.userId;

    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(uid => uid.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ message: isLiked ? "Unliked" : "Liked", likes: post.likes });
  } catch (error: any) {
    console.error("Error in toggleLike", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a comment
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    // @ts-ignore
    const userId = req.user.userId;

    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    post.comments.push({ userId, text });
    await post.save();

    const updatedPost = await Post.findById(id)
      .populate("comments.userId", "name")
      .populate("authorId", "name companyName role isVerified");

    res.status(200).json(updatedPost);
  } catch (error: any) {
    console.error("Error in addComment", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
