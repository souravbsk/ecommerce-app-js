// services/fileUploadService.js

const fs = require("fs");
const path = require("path");
// const { uploadToCloud } = require("../utils/cloudStorage"); // A utility to handle cloud uploads

// Function to handle file uploads
const uploadFile = async (
  folderName,
  buffer,
  fileName,
  options = { cloud: false }
) => {
  try {
    // Check if local storage is required
    if (!options.cloud) {
      // Define the path for local storage
      const localStoragePath = path.join(
        __dirname,
        "..",
        "uploads",
        folderName
      );

      // Create the folder if it doesn't exist
      if (!fs.existsSync(localStoragePath)) {
        fs.mkdirSync(localStoragePath, { recursive: true });
      }

      // Write the file to the local storage
      const filePath = path.join(localStoragePath, fileName);
      fs.writeFileSync(filePath, buffer);
      return { success: true, filePath };
    } else {
      // Upload to cloud storage
    //   const cloudResponse = await uploadToCloud(buffer, fileName, folderName);
    //   return { success: true, cloudResponse };
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { uploadFile };
