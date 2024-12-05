const express = require("express");
const mediaRoutes = express.Router();

const mediaController = require("../../controllers/v1/media.controllers.js");

const { upload } = mediaController;

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Media management
 */

/**
 * @swagger
 * /media/upload:
 *   post:
 *     summary: Upload a media file
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 */

// Upload a media file
// POST /media/upload
mediaRoutes.post(
  "/upload",
  upload.array("mediaFiles", 10),
  mediaController.uploadMedia
);

// Get all media files
// GET /media
mediaRoutes.get("/", mediaController.getAllMedia);

// Get a single media file by ID
// GET /media/:id
mediaRoutes.get("/:id", mediaController.getMediaById);

// Update metadata of a media file
// PUT /media/:id
mediaRoutes.put("/:id", mediaController.updateMedia);

// Delete a media file
// DELETE /media/:id
mediaRoutes.delete("/:id", mediaController.deleteMedia);

module.exports = { mediaRoutes };
