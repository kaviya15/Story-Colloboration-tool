const redis = require("redis");
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
client.on("connect", () => {
  console.log(" ✅ Redis connected");
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
  console.log(storyId, "redis file");
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

async function storeEditingVersion(content, title, storyid) {
  let stringifiedData = JSON.stringify({ title, content });
  await client.set(`Editing:story:${storyid}`, stringifiedData);
}
async function getStoryEditingVersion(storyid) {
  console.log(await client.get(`Editing:story:${storyid}`), storyid);
  return await client.get(`Editing:story:${storyid}`);
}

module.exports = {
  storeUserForStory,
  getWaitingUsers,
  removeNotifiedUser,
  checkUserExits,
  storeEditingVersion,
  getStoryEditingVersion,
};
