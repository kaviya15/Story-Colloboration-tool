const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const { getDB } = require("../config/db"); // MongoDB connection

// Create multer storage (store files in memory before processing)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Wrap multer in a Promise
const multerUpload = (req, res) => {
  return new Promise((resolve, reject) => {
    upload.any()(req, res, (err) => {
      if (err) return reject(err);
      console.log("callback triggered"); // ✅ Now this will be printed
      resolve(req.files); // Resolve when multer finishes processing
    });
  });
};

const uploadFileMiddleware = async (req, res, next) => {
  // try {
  // Step 1: Wait for Multer to finish processing the file
  await multerUpload(req, res);

  // Step 2: Ensure files are present
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Noo file uploaded" });
  }

  // Step 3: Initialize GridFS
  const db = getDB();
  const bucket = new GridFSBucket(db, { bucketName: "uploads" });
  console.log(bucket, "bucekt");
  const file = req.files[0]; // Access the first uploaded file
  const uniqueFilename = `${Date.now()}-${file.originalname}`;
  const uploadStream = bucket.openUploadStream(uniqueFilename, {
    contentType: file.mimetype,
  });

  // Step 4: Write the file to MongoDB
  uploadStream.end(file.buffer);

  uploadStream.on("finish", async () => {
    try {
      console.log("✅ File upload finished");

      // Retrieve the uploaded file's metadata
      const uploadedFiles = await bucket
        .find({ filename: uniqueFilename }) // Query by the unique filename
        .sort({ uploadDate: -1 }) // Get the latest one
        .limit(1)
        .toArray();

      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(500).json({ error: "File upload failed" });
      }

      const uploadedFile = uploadedFiles[0]; // Get the latest uploaded file
      console.log(uploadedFile._id, "✅ Uploaded file metadata");

      req.fileId = uploadedFile._id; // Attach file ID to request
      next(); // ✅ Proceed to the next middleware
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error retrieving uploaded file", details: error });
    }
  });
  uploadStream.on("error", (error) => {
    return res
      .status(500)
      .json({ error: "Error uploading to GridFS", details: error });
  });
  // } catch (error) {
  //   return res
  //     .status(500)
  //     .json({ error: "File processing error", details: error });
  // }
};

module.exports = { uploadFileMiddleware };
