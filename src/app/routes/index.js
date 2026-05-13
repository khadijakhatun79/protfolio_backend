const express = require("express");

const portfolioRoutes = require("../modules/portfolio/portfolio.route");
const serviceRoutes = require("../modules/service/service.route");
const projectRoutes = require("../modules/project/project.route");

const router = express.Router();

router.use("/portfolio", portfolioRoutes);
router.use("/services", serviceRoutes);
router.use("/projects", projectRoutes);

module.exports = router;

