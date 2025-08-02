
const express = require("express");
const {
  getStats,
} = require("../controllers/stats");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.route("/").get(protect, authorize("admin"), getStats);

module.exports = router;
