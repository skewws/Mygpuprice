const express = require("express");
const router = express.Router();
const FileContent = require("../models/FileContent");
const auth = require("../middleware/auth");

router.post("/save", auth, async (req, res) => {
  const { array } = req.body;
  if (!Array.isArray(array)) {
    return res
      .status(400)
      .json({ message: "Invalid data format. Expected an array." });
  }

  try {
    let fileContent = await FileContent.findOne();
    if (!fileContent) {
      fileContent = new FileContent({ fileContent: array });
    } else {
      fileContent.fileContent = array;
    }

    await fileContent.save();
    res.json({
      message: "Array saved successfully",
      fileContent: fileContent.fileContent,
    });
  } catch (err) {
    res.status(500).json({ message: "Error saving array", error: err.message });
  }
});

router.get("/fetch", async (req, res) => {
  try {
    const fileContent = await FileContent.findOne();
    if (!fileContent) {
      return res.status(404).json({ message: "No array found" });
    }
    res.json({ fileContent: fileContent.fileContent, fileContent });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching array", error: err.message });
  }
});

router.post("/empty", async (req, res) => {
  try {
    let fileContent = await FileContent.findOne();
    if (!fileContent) {
      return res.status(404).json({ message: "No array found to empty" });
    }

    fileContent.fileContent = [];
    await fileContent.save();
    res.json({ message: "Array emptied successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error emptying array", error: err.message });
  }
});

module.exports = router;
