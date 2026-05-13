const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const projectService = require("./project.service");
const mongoose = require("mongoose");
const { httpResponse } = require("../../../utils/httpResponse");

const createProject = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const project = await projectService.createProject(req.body, session);
    await session.commitTransaction();
    res.status(httpStatus.CREATED).json(
      httpResponse("success", project, "Project created successfully.")
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

const getProjects = catchAsync(async (req, res) => {
  try {
    const result = await projectService.queryProjects(req.query);
    res.status(httpStatus.OK).json(
      httpResponse("success", result, "Projects found.")
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  }
});

const getProject = catchAsync(async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.projectId);
    if (!project) {
      res.status(httpStatus.NOT_FOUND).json(
        httpResponse("error", {}, "Project not found")
      );
      return;
    }
    res.status(httpStatus.OK).json(
      httpResponse("success", project, "Project found.")
    );
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      httpResponse("error", {}, error.message)
    );
  }
});

const updateProject = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const project = await projectService.updateProjectById(req.params.projectId, req.body, session);
    await session.commitTransaction();
    res.status(httpStatus.OK).json(
      httpResponse("success", project, "Project updated.")
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

const deleteProject = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    await projectService.deleteProjectById(req.params.projectId, session);
    await session.commitTransaction();
    res.status(httpStatus.OK).json(
      httpResponse("success", {}, "Project deleted.")
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
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
