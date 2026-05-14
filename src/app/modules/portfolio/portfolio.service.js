const PortfolioForm = require("./portfolio.model");
const ApiError = require("../../../utils/ApiError");
const httpStatus = require("http-status");

// CREATE
const submitForm = async (formData) => {
  const result = await PortfolioForm.create(formData);
  return result;
};

// GET ALL
const querySubmissions = async (query = {}) => {
  const data = await PortfolioForm.find().sort({ createdAt: -1 });

  return {
    data,
    metaData: {
      total: data.length,
    },
  };
};

// GET ONE
const getSubmissionById = async (id) => {
  const result = await PortfolioForm.findById(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }

  return result;
};

// DELETE
const deleteSubmissionById = async (id) => {
  const result = await PortfolioForm.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }

  return result;
};

module.exports = {
  submitForm,
  querySubmissions,
  getSubmissionById,
  deleteSubmissionById,
};