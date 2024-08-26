const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Heading = require("../models/Heading")

router.post("/save", auth, async (req, res) => {
  const { content } = req.body;
  if (typeof content !== "string" || !content.trim()) {
    return res.status(400).json({
      message: "Invalid content format. Expected a non-empty string.",
    });
  }

  try {
    await Heading.deleteMany({});

    const heading = new Heading({ content });
    await heading.save();
    res.json({ message: "Heading saved successfully", heading });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving heading", error: err.message });
  }
});

router.get("/fetch", async (req, res) => {
  try {
    const heading = await Heading.findOne();
    if (!heading) {
      return res.json({ heading: '' });
    }
    res.json({ heading });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching heading", error: err.message });
  }
});

module.exports = router;
