const Media = require("../models/mediaModel.js");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
// const { uploadToCloud } = require("../utils/cloudStorage.js"); // Hypothetical utility for cloud storage

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const year = new Date().getFullYear();
    const dir = path.join(__dirname, "../uploads", year.toString());
    fs.mkdirSync(dir, { recursive: true }); // Create year-based folder if it doesn't exist
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Upload media file
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const { filename, path: filePath } = req.file;
    const year = new Date().getFullYear();
    const type = determineFileType(filePath); // Custom function to determine file type

    const newMedia = new Media({
      filename,
      path: filePath,
      type,
      year,
      user: req.user._id, // Assuming user is authenticated and available in req.user
      metadata: {
        title: req.body.title || filename,
        description: req.body.description || "",
        size: fs.statSync(filePath).size,
        format: path.extname(filePath).substring(1),
        // Additional metadata fields can be populated here if needed
      },
    });

    await newMedia.save();
    res.status(201).json({ success: true, media: newMedia });
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get all media files
const getAllMedia = async (req, res) => {
  try {
    const mediaFiles = await Media.find().populate("user", "displayName"); // Populate user info if needed
    res.status(200).json({ success: true, media: mediaFiles });
  } catch (error) {
    console.error("Error fetching media files:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get media by ID
const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: "Media not found." });
    }
    res.status(200).json({ success: true, media });
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Update media metadata
const updateMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: "Media not found." });
    }

    const { title, description } = req.body;
    media.metadata.title = title || media.metadata.title;
    media.metadata.description = description || media.metadata.description;

    await media.save();
    res.status(200).json({ success: true, media });
  } catch (error) {
    console.error("Error updating media:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Delete media
const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: "Media not found." });
    }

    // Optionally delete file from storage
    fs.unlinkSync(media.path); // Ensure proper error handling for file deletion

    await Media.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Media deleted successfully." });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Helper function to determine the file type based on extension
const determineFileType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) return "image";
  if ([".mp4", ".avi", ".mov"].includes(ext)) return "video";
  if ([".woff", ".woff2", ".ttf"].includes(ext)) return "font";
  if ([".mp3", ".wav"].includes(ext)) return "audio";
  return "document"; // Default type
};

module.exports = {
  upload,
  uploadMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
};
