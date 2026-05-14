const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const portfolioService = require("./portfolio.service");
const { httpResponse } = require("../../../utils/httpResponse");

const submitForm = catchAsync(async (req, res) => {
  const submission = await portfolioService.submitForm(req.body);

  res.status(httpStatus.CREATED).json(
    httpResponse("success", submission, "Form submitted successfully.")
  );
});

const getSubmissions = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).json(
    httpResponse("success", [], "All submissions fetched successfully.")
  );
});

const getSubmission = catchAsync(async (req, res) => {
  const { id } = req.params;

  res.status(httpStatus.OK).json(
    httpResponse(
      "success",
      { id },
      "Single submission fetched successfully."
    )
  );
});

const deleteSubmission = catchAsync(async (req, res) => {
  const { id } = req.params;

  res.status(httpStatus.OK).json(
    httpResponse(
      "success",
      { id },
      "Submission deleted successfully."
    )
  );
});

module.exports = {
  submitForm,
  getSubmissions,
  getSubmission,
  deleteSubmission,
};