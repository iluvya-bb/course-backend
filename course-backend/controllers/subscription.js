const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

exports.createSubscription = asyncHandler(async (req, res, next) => {
  const { Course, Subscription } = req.db.course.models;
  const { courseId } = req.params;
  const userId = req.user.id;

  const course = await Course.findByPk(courseId);
  if (!course) {
    return next(new ErrorResponse(`Course not found`, 404));
  }

  const subscription = await Subscription.create({ userId, courseId });
  res.status(201).json({
    success: true,
    data: subscription,
  });
});

exports.getSubscriptions = asyncHandler(async (req, res, next) => {
  const { Subscription } = req.db.course.models;
  const subscriptions = await Subscription.findAll({
    where: { userId: req.user.id },
  });
  res.status(200).json({
    success: true,
    data: subscriptions,
  });
});

exports.getAllSubscriptions = asyncHandler(async (req, res, next) => {
  const { Course, Subscription, User } = req.db.course.models;
  const subscriptions = await Subscription.findAll({
    include: [
      { model: User, as: "user", attributes: ["name", "email"] },
      { model: Course, as: "course", attributes: ["title"] },
    ],
  });
  res.status(200).json({
    success: true,
    data: subscriptions,
  });
});
