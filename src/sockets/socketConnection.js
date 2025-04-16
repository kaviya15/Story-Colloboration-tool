const { lockStoryService } = require("../services/storyService");
module.exports.editFunction = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    socket.on("edit", async (storyId, userId) => {
      console.log("Edit is triggered");
      try {
      const response = await lockStoryService(storyId, { userId });
      if (response) socket.broadcast.emit("lock_story", { storyId, userId });
      }catch(err){
        console.error("Error locking story:", err);
      }
    });

    socket.on("publish", async (storyId, userId) => {
      console.log("publish is triggered");
      try {
      socket.broadcast.emit("unlock_story", { storyId, userId });
      /**notify all the users  */
      }catch(err){
        console.error("Error while broadcasting:", err);
      }
    });
  });
};
