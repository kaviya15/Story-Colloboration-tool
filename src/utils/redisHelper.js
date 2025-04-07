const redis = require("redis");
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
client.on("connect", () => {
  console.log("Redis connected");
});
client.connect();

// Store user IDs in the Redis waitlist for a story
async function storeUserForStory(storyId, userId) {
  await client.SADD(`waitlist:story:${storyId}`, userId);
  console.log(`User ${userId} added to waitlist for story ${storyId}`);
  return true;
}
// Get all users in the waitlist for a story
async function getWaitingUsers(storyId) {
  return await client.SMEMBERS(`waitlist:story:${storyId}`);
}

// check if the user exits

async function checkUserExits(storyId, userId) {
  return await client.SISMEMBER(`waitlist:story:${storyId}`, userId);
}

// Remove a user from the waitlist (when notified)
async function removeNotifiedUser(storyId, userId) {
  console.log(`User ${storyId} removing ${userId}`);
  const notifiedUser = await client.SREM(`waitlist:story:${storyId}`, userId);
  console.log(`User ${notifiedUser} has been removed for story ${storyId}`);
  return notifiedUser;
}
module.exports = {
  storeUserForStory,
  getWaitingUsers,
  removeNotifiedUser,
  checkUserExits,
};
