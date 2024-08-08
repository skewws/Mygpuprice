const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const fileMetadataSchema = new mongoose.Schema({
  timestamp: Date,
});
const FileMetadata = mongoose.model("FileMetadata", fileMetadataSchema);

const generateUniqueFilename = (originalname) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalname);
  return `current-file-${timestamp}-${randomStr}${ext}`;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = generateUniqueFilename(file.originalname);
    cb(null, ext);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  await FileMetadata.findOneAndUpdate(
    {},
    { timestamp: new Date() },
    { upsert: true }
  );

  fs.readdir("uploads", (err, files) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Server error while reading directory" });

    files.forEach((file) => {
      if (file !== req.file.filename) {
        const filePath = path.join("uploads", file);
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Error deleting file ${filePath}:`, err);
        });
      }
    });

    res.json({
      message: "File uploaded successfully",
      file: req.file.filename,
    });
  });
});

router.get("/download", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Server error while reading directory" });

    if (files.length === 0)
      return res.status(404).json({ message: "No file found" });

    const mostRecentFile = files.sort(
      (a, b) =>
        fs.statSync(path.join("uploads", b)).mtime -
        fs.statSync(path.join("uploads", a)).mtime
    )[0];
    const filePath = path.join("uploads", mostRecentFile);

    res.download(filePath, (err) => {
      if (err) {
        console.error(`File download error: ${err.message}`);
        return res.status(500).json({ message: "File download error" });
      }
    });
  });
});

router.get("/timestamp", async (req, res) => {
  try {
    const fileMetadata = await FileMetadata.findOne()
      .sort({ timestamp: -1 })
      .exec();

    if (!fileMetadata) {
      return res.status(404).json({ message: "No timestamp found" });
    }

    res.json({ timestamp: fileMetadata.timestamp });
  } catch (err) {
    console.error(`Error fetching timestamp: ${err.message}`);
    res.status(500).json({ message: "Server error while fetching timestamp" });
  }
});

module.exports = router;
