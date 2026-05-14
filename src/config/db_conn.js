var mongoose = require("mongoose");

const connectionString =
  process.env.USE_LOCAL_DB === "true"
    ? process.env.LOCAL_DATABASE
    : process.env.ATLAS_URI;

let dbConnection;

module.exports = {
  connectToServer: async function (callback) {
    try {
      await mongoose.connect(connectionString);

      console.log("Local DB:", process.env.USE_LOCAL_DB);
      console.log("MongoDB Connected Successfully");

      dbConnection = mongoose.connection;

      callback();
    } catch (error) {
      console.log("MongoDB Connection Error:", error);

      callback(error);
    }
  },

  getDb: function () { 
    return dbConnection;
  },
};