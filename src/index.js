const app = require("../app");
const db = require("../config/db_conn");

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await new Promise((resolve, reject) => {
        db.connectToServer((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      isConnected = true;
      console.log("MongoDB Connected (Vercel)");
    }

    return app(req, res);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};