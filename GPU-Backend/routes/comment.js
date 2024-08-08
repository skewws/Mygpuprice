const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

router.post("/save", auth, async (req, res) => {
  const { content } = req.body;
  if (typeof content !== "string" || !content.trim()) {
    return res.status(400).json({
      message: "Invalid content format. Expected a non-empty string.",
    });
  }

  try {
    await Comment.deleteMany({});

    const comment = new Comment({ content });
    await comment.save();
    res.json({ message: "Comment saved successfully", comment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving comment", error: err.message });
  }
});

router.get("/fetch", async (req, res) => {
  try {
    const comment = await Comment.findOne();
    if (!comment) {
      return res.json({ comment: '' });
    }
    res.json({ comment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching comment", error: err.message });
  }
});

module.exports = router;
