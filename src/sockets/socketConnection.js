module.exports.editFunction = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    socket.on("edit", async (storyId, userId) => {
      console.log("Edit is triggered");
      try {
        socket.broadcast.emit("lock_story", { storyId, userId });
      } catch (err) {
        console.error("Error locking story:", err);
      }
    });

    socket.on("publish", (storyId) => {
      console.log("publish is triggered");
      try {
        socket.broadcast.emit("unlock_story", { storyId });
        /**notify all the users  */
      } catch (err) {
        console.error("Error while broadcasting:", err);
      }
    });
  });
};
