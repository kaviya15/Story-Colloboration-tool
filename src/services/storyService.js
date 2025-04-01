const { StoryRepository } = require("../repositories/storyRepository");
const { GridFSBucket } = require("mongodb");
const { getDB } = require("../config/db");
const { base } = require("../models/storyModel");

class StoryService {
  constructor() {
    this.storyRepository = new StoryRepository();
    this.db;
  }
  async createStoryService(fileId, body) {
    console.log(body, "body");
    try {
      const storyData = {
        versions: [
          {
            content: body.content,
            coverImage: fileId,
            lastEditor: body.userID,
          },
        ],
        createdBy: body.userID,
        allContributors: [body.userID],
        tags: body.tags,
      };

      return await this.storyRepository.createStory(storyData);
    } catch (e) {
      return e;
    }
  }

  async getStoryService() {
    try {
      this.db = getDB();
      const stories = await this.storyRepository.findStory();

      const storyData = await Promise.all(
        stories.map(async (story) => {
          story = story.toObject(); // mongodb gives immutable object to make it mutable convert the data object from db to object
          console.log(
            "Before replacement:",
            Array.isArray(story["versions"]),
            story["versions"]
          );

          if (
            Array.isArray(story["versions"]) &&
            story["versions"].length > 0
          ) {
            story["versions"] = {
              ...story["versions"][story["versions"].length - 1],
            };
          }

          console.log("After replacement:", story["versions"]);

          if (story["versions"].coverImage) {
            try {
              console.log(
                "Fetching image for ID:",
                story["versions"].coverImage
              );
              const base64Image = await this._getImageAsBase64(
                story["versions"].coverImage
              );
              story["versions"].coverImage = base64Image;
            } catch (err) {
              console.error("Error retrieving image:", err);
              story["versions"].coverImage = false;
            }
          } else {
            console.warn(`No cover image found for story ${story._id}.`);
            story["versions"].coverImage = false;
          }

          return story;
        })
      );

      return storyData;
    } catch (e) {
      console.error("Error in getStoryService:", e);
      return e;
    }
  }

  async _getImageAsBase64(fileId) {
    return new Promise((resolve, reject) => {
      if (!fileId) {
        console.error("Invalid fileId provided:", fileId);
        return reject(new Error("Invalid file ID"));
      }

      const bucket = new GridFSBucket(this.db, { bucketName: "uploads" });

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
  }
}
module.exports = { StoryService };
