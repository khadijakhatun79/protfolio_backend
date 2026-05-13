const httpStatus = require("http-status");
const Project = require("./project.model");
const ApiError = require("../../../utils/ApiError");
const { get_query } = require("../../../utils/mongooseUtils");

const createProject = async (projectBody, session = null) => {
  const options = session ? { session } : {};
  return Project.create([projectBody], options);
};

const queryProjects = async (query) => {
  const { searchFields, ...tempQuery } = query;
  const { data, meta, page, pageSize } = get_query(
    Project,
    tempQuery,
    {},
    searchFields || ["title", "description", "technologies"]
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

const getProjectById = async (id) => {
  return Project.findById(id);
};

const updateProjectById = async (id, updateBody, session = null) => {
  const options = session ? { session } : {};
  const project = await getProjectById(id);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }
  Object.assign(project, updateBody);
  await project.save(options);
  return project;
};

const deleteProjectById = async (id, session = null) => {
  const options = session ? { session } : {};
  const project = await getProjectById(id);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }
  await project.deleteOne(options);
  return project;
};

module.exports = {
  createProject,
  queryProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
};
