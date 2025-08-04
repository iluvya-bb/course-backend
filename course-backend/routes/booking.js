
const express = require("express");
const {
  createBooking,
  getBookings,
  getBooking,
  acceptBooking,
  payForBooking,
  cancelBooking,
} = require("../controllers/booking");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin"), getBookings)
  .post(protect, createBooking);

router.route("/:id").get(protect, getBooking);

router.route("/:id/accept").put(protect, authorize("teacher"), acceptBooking);

router.route("/:id/pay").put(protect, payForBooking);

router.route("/:id/cancel").put(protect, cancelBooking);

module.exports = router;
