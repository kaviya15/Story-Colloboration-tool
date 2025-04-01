const { StoryRepository } = require("../repositories/storyRepository");
const { getImageAsBase64 } = require("../utils/imageConverter");
class StoryService {
  constructor() {
    this.storyRepository = new StoryRepository();
  }
  async createStoryService(fileId, body) {
    console.log(body, "body");
    try {
      const storyData = {
        title: body.title,
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

  async getAllStoryService() {
    try {
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
              const base64Image = await getImageAsBase64(
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

  async getStoryService(storyId) {
    try {
      const stories = await this.storyRepository.findStoryById(storyId);

      const storyData = await Promise.all(
        stories.map(async (story) => {
          story = story.toObject(); // mongodb gives immutable object to make it mutable convert the data object from db to object
          if (
            Array.isArray(story["versions"]) &&
            story["versions"].length > 0
          ) {
            story["versions"] = {
              ...story["versions"][story["versions"].length - 1],
            };
          }
          if (story["versions"].coverImage) {
            try {
              const base64Image = await getImageAsBase64(
                story["versions"].coverImage
              );
              story["versions"].coverImage = base64Image;
            } catch (err) {
              story["versions"].coverImage = false;
            }
          } else {
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

  async likeStoryService(storyId, body) {
    try {
      console.log("story id ", storyId);
      const { userId } = body;
      let story = await this.storyRepository.findStoryById(storyId);
      story = story.toObject();
      console.log("Story", story.likedBy);
      if (!story.likedBy.some((id) => id.toString() == userId)) {
        return await this.storyRepository.likeStory(storyId, userId);
      } else {
        return await this.storyRepository.unLikeStory(storyId, userId);
      }
    } catch (err) {
      console.log("error", err);
      return err;
    }
  }

  async notifyUserService() {
    //use redis
  }
}
module.exports = { StoryService };
