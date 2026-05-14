const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const portfolioService = require("./portfolio.service");
const { httpResponse } = require("../../../utils/httpResponse");

const submitForm = catchAsync(async (req, res) => {
  try {
    const submission = await portfolioService.submitForm(req.body);

    res.status(httpStatus.CREATED).json(
      httpResponse("success", submission, "Form submitted successfully.")
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  }
});

module.exports = {
  submitForm,
};