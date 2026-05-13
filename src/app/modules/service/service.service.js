const httpStatus = require("http-status");
const Service = require("./service.model");
const ApiError = require("../../../utils/ApiError");
const { get_query } = require("../../../utils/mongooseUtils");

const createService = async (serviceBody, session = null) => {
  const options = session ? { session } : {};
  return Service.create([serviceBody], options);
};

const queryServices = async (query) => {
  const { searchFields, ...tempQuery } = query;
  const { data, meta, page, pageSize } = get_query(
    Service,
    tempQuery,
    {},
    searchFields || ["title", "description"]
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

const getServiceById = async (id) => {
  return Service.findById(id);
};

const updateServiceById = async (id, updateBody, session = null) => {
  const options = session ? { session } : {};
  const service = await getServiceById(id);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }
  Object.assign(service, updateBody);
  await service.save(options);
  return service;
};

const deleteServiceById = async (id, session = null) => {
  const options = session ? { session } : {};
  const service = await getServiceById(id);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }
  await service.deleteOne(options);
  return service;
};

module.exports = {
  createService,
  queryServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
};
