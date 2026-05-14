const mongoose = require("mongoose");

const connectionString =
  process.env.USE_LOCAL_DB === "true"
    ? process.env.LOCAL_DATABASE
    : process.env.ATLAS_URI;

let isConnected = false;

const connectToServer = async () => {
  try {
    if (isConnected || mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }

    if (!connectionString) {
      throw new Error("MongoDB connection string missing");
    }

    await mongoose.connect(connectionString);

    isConnected = true;

    console.log("MongoDB Connected Successfully");

    return mongoose.connection;

  } catch (error) {
    console.log("MongoDB Connection Error:", error);
    throw error;
  }
};

const getDb = () => {
  return mongoose.connection;
};

module.exports = {
  connectToServer,
  getDb,
};