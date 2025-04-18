const { StoryRepository } = require("../repositories/storyRepository");
const { getImageAsBase64 } = require("../utils/imageConverter");
const { findById } = require("../repositories/userRepository");
const { deleteLogs } = require("../repositories/logRepository");
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
    // console.log(body, "body");
    try {
      const storyData = {
        versions: [
          {
            title: body.title,
            content: body.content,
            coverImage: fileId,
            lastEditor: body.userID,
            tags: body.tags,
          },
        ],
        createdBy: body.userID,
        allContributors: [body.userID],
      };

      return await this.storyRepository.createStory(storyData);
    } catch (e) {
      return e;
    }
  }

  async _getStoryDetails(story) {
    // console.log("story", story);
    story = story.toObject(); // mongodb gives immutable object to make it mutable convert the data object from db to object
    const user = await findById(story.createdBy);
    // console.log(user, "user", story.createdBy);
    story.owner = user.name;

    if (Array.isArray(story["versions"]) && story["versions"].length > 0) {
      story["versions"] = {
        ...story["versions"][story["versions"].length - 1],
      };
    }

    if (story["versions"].coverImage) {
      try {
        // console.log("Fetching image for ID:", story["versions"].coverImage);
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

    story["contributors"] = await Promise.all(
      story.allContributors.map(async (val) => {
        const user = await findById(val);
        return {
          id: val,
          name: user.name,
          profilePic: "user.profilePic",
        };
      })
    );

    return story;
  }
  async getAllStoryService() {
    try {
      const stories = await this.storyRepository.findStory();

      const storyData = await Promise.all(
        stories.map(async (story) => {
          story = await this._getStoryDetails(story);
          story["image"] = story["versions"].coverImage;
          story["versions"].content = "";
          story["versions"].coverImage = "";
          // let { versions, ...rest } = story;
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
      // console.log(story, "Story");
      story = await this._getStoryDetails(story);
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
      story = story.versions[story.versions.length - 1];
      console.log("Story", story);
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
      console.log("storyid", storyId);
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
      console.log("redis userids", userId);
      for (let ids of userId) {
        /**using userid get the email id or store the email id in the redis */
        const user_details = await findById(ids);
        const notify_user = await sendEmail(
          user_details.email,
          storyTitle,
          user_details.name
        );

        if (notify_user) {
          const response = await removeNotifiedUser(storyId, userId);
        }
      }

      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async unLockStoryService(storyId, storyTitle) {
    try {
      // const { storyTitle, context } = body;
      /**unlock story get from version from  */
      const response = await this.storyRepository.unLockStory(storyId);

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

      const { userId } = body;
      if (story.currentEditor && story.currentEditor != userId) {
        throw new Error(story.currentEditor);
      }
      const response = await this.storyRepository.lockStory(storyId, userId);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async saveEditedVersion(storyId, fileId, body) {
    try {
      let { content, userID, tags, title } = body;
      console.log("eding verson ", title);
      await this.unLockStoryService(storyId, title);
      let story = {
        content: content,
        coverImage: fileId,
        lastEditor: userID,
        tags,
        title,
      };
      if (fileId == undefined) {
        //get the latest story version object id
        const storyData = await this.storyRepository.findStoryById(storyId);
        if (storyData.versions[storyData.versions.length - 1].coverImage)
          story["coverImage"] =
            storyData.versions[storyData.versions.length - 1].coverImage;
      }

      const response = await this.storyRepository.saveEditedVersion(
        storyId,
        story,
        userID
      );
      return response;
    } catch (err) {
      return err;
    }
  }

  async getPaginatedStories(pageParam, limitParam) {
    try {
      const page = parseInt(pageParam);
      const limit = parseInt(limitParam);
      const skip = (page - 1) * limit;
      const stories = await this.storyRepository.findStoriesByCount(
        skip,
        limit
      );
      const total = await this.storyRepository.findStoryCount();
      return {
        page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: stories,
      };
    } catch (err) {
      return { error: err.message || "Error in pagination", statusCode: 500 };
    }
  }

  async findByIdAndDelete(storyId) {
    try {
      const deleted = await this.storyRepository.findByIdAndDelete(storyId);
      const deletedLogs = await deleteLogs(storyId);
      if (!deleted && deletedLogs) {
        throw new Error("No logs found for the story");
      }
      return {
        message: "Story deleted successfully",
        story: deleted,
      };
    } catch (err) {
      return { error: err.message || "Error deleting story", statusCode: 500 };
    }
  }

  async findByUserId(userId) {
    try {
      const stories = await this.storyRepository.findStoriesByUserId(userId);
      if (!stories || stories.length === 0) {
        return { error: "No stories found for this user", statusCode: 404 };
      }
      const storyData = await Promise.all(
        stories.map(async (story) => {
          story = await this._getStoryDetails(story);
          story["image"] = story["versions"].coverImage;
          story["versions"].content = "";
          story["versions"].coverImage = "";
          let { versions, content, coverImage, ...rest } = story["versions"];
          return story;
        })
      );
      return storyData;
    } catch (err) {
      return { error: err.message || "Error fetching story", statusCode: 500 };
    }
  }

  async versionStory(storyId, v_id = null) {
    try {
      console.log(storyId);
      let storyData;
      if (v_id) {
        storyData = await this.storyRepository.findStoriesByversionId(v_id);
        storyData = storyData.toObject();
        storyData = storyData["versions"];
        console.log(storyData, "storyData");
        const base64Image = await getImageAsBase64(storyData[0].coverImage);
        storyData[0].coverImage = base64Image;
      } else {
        let story = await this.storyRepository.findStoryById(storyId);
        // console.log(story);
        story = story.toObject();

        if (!story) {
          throw new Error("Story not found");
        }
        let s = story["versions"].filter((value) => value.lastEditor);
        storyData = Promise.all(
          s.map(async (version) => {
            const user = await findById(version.lastEditor);

            return [
              {
                id: version._id,
                lastEditor: user.name,
                updatedTime: version.updatedTime,
              },
            ];
          })
        );
      }

      return storyData;
    } catch (err) {
      console.error("Error fetching story version:", err);
      throw err; // or handle accordingly
    }
  }
}

module.exports = { StoryService };
