// // utils/cloudStorage.js

// const AWS = require("aws-sdk");
// const { v4: uuidv4 } = require("uuid");

// // Initialize S3 client
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
// });

// // Function to upload file to S3
// const uploadToCloud = async (buffer, fileName, folderName) => {
//     const params = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: `${folderName}/${uuidv4()}-${fileName}`, // Unique file name
//         Body: buffer,
//         ContentType: "image/jpeg", // Adjust content type based on your use case
//         ACL: "public-read", // Optional: set access control
//     };

//     // Upload the file to S3
//     const result = await s3.upload(params).promise();
//     return result; // Return the result of the upload
// };

// module.exports = { uploadToCloud };
