const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const serviceService = require("./service.service");
const { httpResponse } = require("../../../utils/httpResponse");

const createService = catchAsync(async (req, res) => {
  try {
    const service = await serviceService.createService(req.body);
    res.status(httpStatus.CREATED).json(
      httpResponse("success", service, "Service created successfully.")
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  }
});

const getServices = catchAsync(async (req, res) => {
  try {
    const result = await serviceService.queryServices(req.query);
    res.status(httpStatus.OK).json(
      httpResponse("success", result, "Services found.")
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  }
});

const getService = catchAsync(async (req, res) => {
  try {
    const service = await serviceService.getServiceById(req.params.serviceId);
    if (!service) {
      res.status(httpStatus.NOT_FOUND).json(
        httpResponse("error", {}, "Service not found")
      );
      return;
    }
    res.status(httpStatus.OK).json(
      httpResponse("success", service, "Service found.")
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  }
});

const updateService = catchAsync(async (req, res) => {
  try {
    const service = await serviceService.updateServiceById(
      req.params.serviceId,
      req.body
    );
    res.status(httpStatus.OK).json(
      httpResponse("success", service, "Service updated.")
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  }
});

const deleteService = catchAsync(async (req, res) => {
  try {
    await serviceService.deleteServiceById(req.params.serviceId);
    res.status(httpStatus.OK).json(
      httpResponse("success", {}, "Service deleted.")
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  }
});

module.exports = {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
};
