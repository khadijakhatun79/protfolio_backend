const express = require("express");
const projectController = require("./project.controller");

const router = express.Router();

router
  .route("/")
  .post(projectController.createProject)
  .get(projectController.getProjects);

router
  .route("/:projectId")
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
