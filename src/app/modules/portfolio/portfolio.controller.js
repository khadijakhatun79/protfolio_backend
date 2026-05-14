const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const portfolioService = require("./portfolio.service");

const submitForm = catchAsync(async (req, res) => {
  console.log("BODY:", req.body);

  const submission = await portfolioService.submitForm(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Form submitted successfully",
    data: submission,
  });
});

const getSubmissions = catchAsync(async (req, res) => {
  const result = await portfolioService.querySubmissions(req.query);

  res.status(httpStatus.OK).json({
    success: true,
    message: "All submissions fetched successfully",
    data: result,
  });
});

const getSubmission = catchAsync(async (req, res) => {
  const result = await portfolioService.getSubmissionById(req.params.submissionId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Single submission fetched successfully",
    data: result,
  });
});

const deleteSubmission = catchAsync(async (req, res) => {
  const result = await portfolioService.deleteSubmissionById(req.params.submissionId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Submission deleted successfully",
    data: result,
  });
});

module.exports = {
  submitForm,
  getSubmissions,
  getSubmission,
  deleteSubmission,
};