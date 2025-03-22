const { StoryRepository } = require("../repositories/storyRepository");
class StoryService {
  constructor() {
    this.storyRepository = new StoryRepository();
    console.log(" repo story");
  }
  async createStoryService(body) {
    console.log(" repo body", body);
    try {
      const storyData = {
        versions: [
          {
            content: body.content,
            img: "",
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
}

module.exports = { StoryService };
