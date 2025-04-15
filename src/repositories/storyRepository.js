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
      const story = await Story.findById(storyId);
      const lastIndex = story.versions.length - 1;
      if (lastIndex < 0) throw new Error("No versions found.");

      const updateFieldLikes = `versions.${lastIndex}.likes`;
      const updateFieldLikedBy = `versions.${lastIndex}.likedBy`;

      const updated = await Story.findByIdAndUpdate(
        storyId,
        {
          $inc: { [updateFieldLikes]: 1 },
          $push: { [updateFieldLikedBy]: userId },
        },
        { new: true }
      );

      return updated.versions[lastIndex].likes;
    } catch (e) {
      console.error("Error in liek:", e);
      return e;
    }
  }

  async unLikeStory(storyId, userId) {
    try {
      const story = await Story.findById(storyId);
      const lastIndex = story.versions.length - 1;
      if (lastIndex < 0) throw new Error("No versions found.");

      const updateFieldLikes = `versions.${lastIndex}.likes`;
      const updateFieldLikedBy = `versions.${lastIndex}.likedBy`;

      const updated = await Story.findByIdAndUpdate(
        storyId,
        {
          $inc: { [updateFieldLikes]: -1 },
          $pull: { [updateFieldLikedBy]: userId },
        },
        { new: true }
      );

      return updated.versions[lastIndex].likes;
    } catch (e) {
      console.error("Error in unLikeStory:", e);
      return e;
    }
  }

  async lockStory(storyId, userId) {
    try {
      const data = await Story.findByIdAndUpdate(
        storyId,
        {
          $set: { currentEditor: userId }, // set the current editor
        },
        { new: true } // Return the updated story
      );
      console.log("data", data);
      return data;
    } catch (e) {
      return e;
    }
  }
  async unLockStory(storyId) {
    try {
      const data = await Story.findByIdAndUpdate(
        storyId,
        {
          $set: { currentEditor: null }, // set the current editor
        },
        { new: true } // Return the updated story
      );
      console.log("data", data);
      return data;
    } catch (e) {
      return e;
    }
  }

  async saveEditedVersion(storyId, story, userId) {
    try {
      const data = await Story.findByIdAndUpdate(
        storyId,
        {
          $push: { versions: story },
          $addToSet: { allContributors: userId },
        },
        { new: true } // Return the updated story
      );
      console.log("edited version", data);
      const freshStory = await Story.findById(storyId);
      return data;
    } catch (e) {
      throw e;
    }
  }
  async findByIdAndDelete(storyId) {
    try {
      const deletedStory = await Story.findByIdAndDelete(storyId);
      console.log('Deleted story:', deletedStory);
      return deletedStory;
    } catch (e) {
      throw e;
    }
  }

}

module.exports = { StoryRepository };
