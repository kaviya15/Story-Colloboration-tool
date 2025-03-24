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
}

module.exports = { StoryRepository };
