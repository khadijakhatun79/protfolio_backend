const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const portfolioService = require("./portfolio.service");
const mongoose = require("mongoose");
const { httpResponse } = require("../../../utils/httpResponse");

const submitForm = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const submission = await portfolioService.submitForm(req.body, session);
    await session.commitTransaction();
    res.status(httpStatus.CREATED).json(
      httpResponse("success", submission, "Form submitted successfully.")
    );
  } catch (error) {
    await session.abortTransaction();
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  } finally {
    session.endSession();
  }
});

const getSubmissions = catchAsync(async (req, res) => {
  try {
    const result = await portfolioService.querySubmissions(req.query);
    res.status(httpStatus.OK).json(
      httpResponse("success", result, "Submissions found.")
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  }
});

const getSubmission = catchAsync(async (req, res) => {
  try {
    const submission = await portfolioService.getSubmissionById(req.params.submissionId);
    if (!submission) {
      res.status(httpStatus.NOT_FOUND).json(
        httpResponse("error", {}, "Submission not found")
      );
      return;
    }
    res.status(httpStatus.OK).json(
      httpResponse("success", submission, "Submission found.")
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  }
});

const deleteSubmission = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    await portfolioService.deleteSubmissionById(req.params.submissionId, session);
    await session.commitTransaction();
    res.status(httpStatus.OK).json(
      httpResponse("success", {}, "Submission deleted.")
    );
  } catch (error) {
    await session.abortTransaction();
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  } finally {
    session.endSession();
  }
});

module.exports = {
  submitForm,
  getSubmissions,
  getSubmission,
  deleteSubmission,
};
