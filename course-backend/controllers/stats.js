const asyncHandler = require("../middlewares/async");

exports.getStats = asyncHandler(async (req, res, next) => {
  const { User, Course, Subscription } = req.db.course.models;
  const totalUsers = await User.count();
  const totalCourses = await Course.count();
  const totalSubscriptions = await Subscription.count();

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalCourses,
      totalSubscriptions,
    },
  });
});
