const app = require("../app");
const { connectToServer } = require("../config/db_conn");

let isConnected = false;

module.exports = async (req, res) => {
  try {
    // connect DB only once
    if (!isConnected) {
      await new Promise((resolve, reject) => {
        connectToServer((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      isConnected = true;
      console.log("MongoDB Connected");
    }

    return app(req, res);

  } catch (error) {
    console.error("Vercel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};