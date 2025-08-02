
const express = require("express");
const {
  createParameter,
  getParameters,
  getParameter,
  updateParameter,
  deleteParameter,
} = require("../controllers/parameter");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(getParameters)
  .post(protect, authorize("admin"), createParameter);

router
  .route("/:key")
  .get(getParameter)
  .put(protect, authorize("admin"), updateParameter)
  .delete(protect, authorize("admin"), deleteParameter);

module.exports = router;
