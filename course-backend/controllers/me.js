
const asyncHandler = require("../middlewares/async");

// @desc    Get current user's bookings
// @route   GET /api/v1/me/bookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const { Booking } = req.db.course.models;
  const bookings = await Booking.findAll({ where: { userId: req.user.id } });
  res.status(200).json({ success: true, data: bookings });
});

// @desc    Get current user's subscriptions
// @route   GET /api/v1/me/subscriptions
// @access  Private
exports.getMySubscriptions = asyncHandler(async (req, res, next) => {
  const { Subscription } = req.db.course.models;
  const subscriptions = await Subscription.findAll({ where: { userId: req.user.id } });
  res.status(200).json({ success: true, data: subscriptions });
});
