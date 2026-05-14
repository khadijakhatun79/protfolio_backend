const httpStatus = require("http-status");
const PortfolioForm = require("./portfolio.model");
const ApiError = require("../../../utils/ApiError");
const { get_query } = require("../../../utils/mongooseUtils");

const submitForm = async (formData) => {
  return PortfolioForm.create(formData);
};

const querySubmissions = async (query) => {
  const { searchFields, ...tempQuery } = query;
  const { data, meta, page, pageSize } = get_query(
    PortfolioForm,
    tempQuery,
    {},
    searchFields || ["name", "email", "subject", "message"]
  );
  let [singlePageData, totalDocs] = await Promise.all([data, meta]);

  return {
    data: singlePageData,
    metaData: {
      page,
      totalPages: Math.ceil((totalDocs[0]?.count || 0) / pageSize),
      perPage: pageSize,
      total: totalDocs[0]?.count || 0,
    },
  };
};

const getSubmissionById = async (id) => {
  return PortfolioForm.findById(id);
};

const deleteSubmissionById = async (id) => {
  const submission = await getSubmissionById(id);
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
  }
  await submission.deleteOne();
  return submission;
};

module.exports = {
  submitForm,
  querySubmissions,
  getSubmissionById,
  deleteSubmissionById,
};
