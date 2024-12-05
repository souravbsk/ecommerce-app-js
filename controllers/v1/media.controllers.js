const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Media = require("../../models/mediaModels");
// const { uploadToCloud } = require("../utils/cloudStorage.js"); // Hypothetical utility for cloud storage

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const year = new Date().getFullYear();
    const dir = path.join(__dirname, "../.././uploads", year.toString());
    fs.mkdirSync(dir, { recursive: true }); // Create year-based folder if it doesn't exist
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
// 10 is the max number of files to upload
// Upload media file(s)
// Unified upload media function
const uploadMedia = async (req, res) => {
  try {
    // Check if files are present in req.files
    const files = req.files || []; // Use req.files if present (multiple), or an empty array

    // Check if a single file was uploaded
    if (req.file) {
      files.push(req.file); // If a single file was uploaded, push it into the files array
    }

    if (files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded." });
    }

    const mediaRecords = []; // To store created media records

    for (const file of files) {
      const { filename } = file;
      const year = new Date().getFullYear();
      const type = determineFileType(file.path); // Use the original file path to determine type

      // Use forward slashes in the relative path
      const relativePath = `uploads/${year}/${filename}`; // Generates 'uploads/2024/filename'

      const newMedia = new Media({
        filename,
        path: relativePath, // Store relative path here
        type,
        year,
        // user: req.user._id, // Assuming user is authenticated and available in req.user
        metadata: {
          title: req.body.title || filename,
          description: req.body.description || "",
          size: fs.statSync(file.path).size,
          format: path.extname(file.path).substring(1),
        },
      });

      await newMedia.save();
      mediaRecords.push(newMedia);
    }

    res.status(201).json({ success: true, media: mediaRecords });
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get all media files
// Get all media files with pagination
const getAllMedia = async (req, res) => {
  try {
    // Get page and limit from query parameters, with defaults if not provided
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10 items per page
    const skip = (page - 1) * limit;

    // Find media files with pagination
    const mediaFiles = await Media.find()
      .skip(skip)
      .limit(limit)
      .populate("user", "displayName"); // Populate user info if needed

    // Get total number of media files for calculating the total number of pages
    const totalMediaFiles = await Media.countDocuments();
    const totalPages = Math.ceil(totalMediaFiles / limit);

    res.status(200).json({
      success: true,
      media: mediaFiles,
      pagination: {
        totalItems: totalMediaFiles,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
      },
    });
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
      return res
        .status(404)
        .json({ success: false, message: "Media not found." });
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

    console.log(req.body)
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res
        .status(404)
        .json({ success: false, message: "Media not found." });
    }

    const { title, description } = req.body;
    media.metadata.title = title || media.metadata.title;
    media.metadata.description = description || media.metadata.description;

    await media.save();
    console.log(media)
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
      return res
        .status(404)
        .json({ success: false, message: "Media not found." });
    }

    // Optionally delete file from storage
    fs.unlinkSync(media.path); // Ensure proper error handling for file deletion

    await Media.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Media deleted successfully." });
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
