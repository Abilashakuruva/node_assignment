const express = require("express");
const axios = require("axios");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const router = express.Router();

// 1. Load 10 users along with posts and comments
router.get("/load", async (req, res) => {
  try {
    const usersResponse = await axios.get("https://jsonplaceholder.typicode.com/users");
    const postsResponse = await axios.get("https://jsonplaceholder.typicode.com/posts");
    const commentsResponse = await axios.get("https://jsonplaceholder.typicode.com/comments");

    const users = usersResponse.data.slice(0, 10);
    const posts = postsResponse.data;
    const comments = commentsResponse.data;

    await User.insertMany(users);
    await Post.insertMany(posts);
    await Comment.insertMany(comments);

    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: "Error loading data", error });
  }
});

// 2. Delete all users
router.delete("/users", async (req, res) => {
  try {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    res.status(200).json({ message: "All users deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting users", error });
  }
});

// 3. Delete a specific user by ID
router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    await User.deleteOne({ id: userId });
    await Post.deleteMany({ userId: userId });
    await Comment.deleteMany({ postId: userId });

    res.status(200).json({ message: `User ${userId} deleted` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// 4. Get user details including posts & comments
router.get("/users/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ userId: userId });
    for (let post of posts) {
      post.comments = await Comment.find({ postId: post.id });
    }

    res.status(200).json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// 5. Insert a new user
router.put("/users", async (req, res) => {
  try {
    const existingUser = await User.findOne({ id: req.body.id });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
});

module.exports = router;
