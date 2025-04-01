const Story = require("../models/storyModel");

class StoryRepository {
  async createStory(storyData) {
    try {
      const data = new Story(storyData);
      const saveData = await data.save();
      return saveData;
    } catch (e) {
      return e;
    }
  }

  async findStory() {
    try {
      const stories = await Story.find();
      return stories;
    } catch (e) {
      return e;
    }
  }
  async findStoryById(storyId) {
    try {
      const story = await Story.findById(storyId);
      return story;
    } catch (e) {
      return e;
    }
  }

  async likeStory(storyId, userId) {
    try {
      const data = await Story.findByIdAndUpdate(
        storyId,
        {
          $inc: { likes: 1 }, // Increment the likes by 1
          $push: { likedBy: userId },
        },
        { new: true } // Return the updated story
      );
      console.log("data", data);
      return data["likes"];
    } catch (e) {
      return e;
    }
  }
  async unLikeStory(storyId, userId) {
    try {
      const data = await Story.findByIdAndUpdate(
        storyId,
        {
          $inc: { likes: -1 }, // Increment the likes by 1
          $pull: { likedBy: userId },
        },
        { new: true } // Return the updated story
      );
      console.log("data", data);
      return data["likes"];
    } catch (e) {
      return e;
    }
  }
}

module.exports = { StoryRepository };
