const { StoryRepository } = require("../repositories/storyRepository");
const { getImageAsBase64 } = require("../utils/imageConverter");
const { findById } = require("../repositories/userRepository");
const {
  storeUserForStory,
  checkUserExits,
  getWaitingUsers,
  removeNotifiedUser,
} = require("../utils/redisHelper");
const { sendEmail } = require("../utils/email");
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
              console.log(
                "Fetching image for ID:",
                story["versions"].coverImage
              );
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
      return e;
    }
  }

  async getStoryService(storyId) {
    try {
      let story = await this.storyRepository.findStoryById(storyId);
      console.log(story, "Story");
      story = story.toObject(); // mongodb gives immutable object to make it mutable convert the data object from db to object

      if (Array.isArray(story["versions"]) && story["versions"].length > 0) {
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

  async subscribeNotificationsService(storyId, body) {
    try {
      const { userId } = body;
      /** check if the user id is redis   */

      const userExists = await checkUserExits(storyId, userId);
      console.log("user exists", userExists);
      if (!userExists) {
        const response = await storeUserForStory(storyId, userId);
        console.log("user created", response);
        return response;
      }
      return true;
    } catch (err) {
      return err;
    }
  }

  async sendNotificationsService(storyId, storyTitle) {
    try {
      /** check if the user id is redis   */
      console.log("spublish notify");
      const userId = await getWaitingUsers(storyId);
      for (let ids of userId) {
        console.log("user userId", userId);
        /**using userid get the email id or store the email id in the redis */
        const user_details = await findById(ids);
        console.log("user details", user_details);
        const notify_user = await sendEmail(
          user_details.email,
          storyTitle,
          user_details.name
        );
        console.log(
          "user EMAIL DETAILS",
          user_details.email,
          storyTitle,
          user_details.name,
          notify_user
        );
        if (notify_user) {
          const response = await removeNotifiedUser(storyId, userId);
          return response;
        }
      }

      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async unLockStory(storyId, body) {
    try {
      const { storyTitle, context } = body;
      /**unlock story get from version from  */
      await this.sendNotificationsService(storyId, storyTitle);
      /**notify the users */
      return true;
    } catch (err) {
      return err;
    }
  }

  async lockStoryService(storyId, body) {
    try {
      let story = await this.storyRepository.findStoryById(storyId);
      if (story.currentEditor) {
        return false;
      }
      const { userId } = body;
      const response = await this.storyRepository.lockStory(storyId, userId);
      return response;
    } catch (err) {
      return err;
    }
  }
}
module.exports = { StoryService };
