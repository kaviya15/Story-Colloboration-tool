const { getDB } = require("../config/db");
const { GridFSBucket } = require("mongodb");
module.exports.getImageAsBase64 = async (fileId) => {
  return new Promise((resolve, reject) => {
    if (!fileId) {
      console.error("Invalid fileId provided:", fileId);
      return reject(new Error("Invalid file ID"));
    }
    const db = getDB();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    try {
      const downloadStream = bucket.openDownloadStream(fileId);
      let data = [];

      downloadStream.on("data", (chunk) => {
        data.push(chunk);
      });

      downloadStream.on("end", () => {
        const buffer = Buffer.concat(data);
        const base64Image = buffer.toString("base64");
        console.log("Image successfully converted to base64.");
        resolve(base64Image);
      });

      downloadStream.on("error", (error) => {
        console.error("GridFS Error:", error);
        reject(error);
      });
    } catch (error) {
      console.error("Error opening download stream:", error);
      reject(error);
    }
  });
};
