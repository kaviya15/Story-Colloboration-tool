const { lockStoryService } = require("../services/storyService");
module.exports.editFunction = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    socket.on("edit", async (storyId, userId) => {
      console.log("Edit is triggered");
      const response = await lockStoryService(storyId, { userId });
      if (response) socket.broadcast.emit("lock_story", { storyId, userId });
    });

    socket.on("publish", async (storyId, userId) => {
      console.log("publish is triggered");
      socket.broadcast.emit("unlock_story", { storyId, userId });
      /**notify all the users  */
    });
  });
};
