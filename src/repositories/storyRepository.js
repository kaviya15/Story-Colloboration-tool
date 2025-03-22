const Story = require("../models/storyModel");

class StoryRepository {
  async createStory(storyData) {
    try {
      console.log("story repo", storyData);
      const data = new Story(storyData);
      const saveData = await data.save();
      console.log(saveData, "saved data");
      return saveData;
    } catch (e) {
      console.log("eeror", e);
      return e;
    }
  }
}

module.exports = { StoryRepository };
