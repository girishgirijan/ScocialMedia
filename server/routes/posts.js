import express from "express";
import {getFeedPosts, getUserPosts, likePosts, addComment} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* Read from database */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);


/* Update  database */
router.patch("/:id/like", verifyToken, likePosts);
router.patch("/:id/comment", verifyToken, addComment);

export default router;