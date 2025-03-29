const mongoose = require("mongoose");
let db;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = conn.connection.db;

    console.log(" ✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

module.exports = { connectDB, getDB };
