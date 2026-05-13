const express = require("express");
const serviceController = require("./service.controller");

const router = express.Router();

router
  .route("/")
  .post(serviceController.createService)
  .get(serviceController.getServices);

router
  .route("/:serviceId")
  .get(serviceController.getService)
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

module.exports = router;
