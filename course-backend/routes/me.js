
const express = require("express");
const {
  getMyBookings,
  getMySubscriptions,
} = require("../controllers/me");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.route("/bookings").get(getMyBookings);
router.route("/subscriptions").get(getMySubscriptions);

module.exports = router;
