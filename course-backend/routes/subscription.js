
const express = require("express");
const {
  createSubscription,
  getSubscriptions,
  getAllSubscriptions,
} = require("../controllers/subscription");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getSubscriptions)
  .post(protect, createSubscription);

router
  .route("/all")
  .get(protect, authorize("admin"), getAllSubscriptions);

module.exports = router;
