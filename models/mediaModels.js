const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true, // Full path to the file
  },
  type: {
    type: String,
    enum: ["image", "video", "font", "audio", "document"], // Include more types as needed
    required: true,
  },
  year: {
    type: Number,
    required: true, // Year the file was uploaded
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who uploaded
    // required: true,
  },
  metadata: {
    title: { type: String }, // Title of the media file
    description: { type: String }, // Description of the media file
    dimensions: {
      // Specific to images/videos
      width: { type: Number },
      height: { type: Number },
    },
    duration: { type: Number }, // Duration in seconds for videos/audio
    size: { type: Number }, // Size in bytes
    format: { type: String }, // Format of the file (e.g., jpg, mp4, etc.)
    keywords: [{ type: String }], // Tags or keywords for better searching
  },
  isPublic: {
    type: Boolean,
    default: false, // To control access
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  version: {
    type: Number,
    default: 1, // To manage versions of the file
  },
  relatedFiles: [
    {
      // To link related media files
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
  ],
});

// Update updatedAt field on save
mediaSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Media = mongoose.model("Media", mediaSchema);

module.exports = Media;
