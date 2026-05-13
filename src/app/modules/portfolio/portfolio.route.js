const express = require("express");
const portfolioController = require("./portfolio.controller");

const router = express.Router();

router
  .route("/")
  .post(portfolioController.submitForm)
  .get(portfolioController.getSubmissions);

router
  .route("/:submissionId")
  .get(portfolioController.getSubmission)
  .delete(portfolioController.deleteSubmission);

module.exports = router;
