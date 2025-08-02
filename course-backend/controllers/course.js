const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const upload = require("../configs/uploads");

exports.createCourse = asyncHandler(async (req, res, next) => {
  const { Course } = req.db.course.models;
  if (req.file) {
    req.body.bannerImage = req.file.path;
  }
  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    data: course,
  });
});

exports.getCourses = asyncHandler(async (req, res, next) => {
  const { Course } = req.db.course.models;
  const courses = await Course.findAll();
  res.status(200).json({
    success: true,
    data: courses,
  });
});

exports.getCourse = asyncHandler(async (req, res, next) => {
  const { Course, Lesson, Subscription, Exercise } = req.db.course.models;
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: Lesson,
        as: "lessons",
        include: {
          model: Exercise,
          as: "exercises",
        },
      },
      {
        model: Subscription,
        as: "subscriptions",
        where: { userId: req.user.id },
        required: false,
      },
    ],
  });

  if (!course) {
    return next(new ErrorResponse(`Course not found`, 404));
  }

  const isSubscribed = course.subscriptions && course.subscriptions.length > 0;

  if (!isSubscribed) {
    course.lessons.forEach((lesson) => {
      lesson.content = undefined;
      lesson.wysiwygContent = undefined;
      lesson.exercises = [];
    });
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { Course } = req.db.course.models;
  let course = await Course.findByPk(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`Course not found`, 404));
  }
  if (req.file) {
    req.body.bannerImage = req.file.path;
  }
  course = await course.update(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { Course } = req.db.course.models;
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`Course not found`, 404));
  }
  await course.destroy();
  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getSubscribedUsers = asyncHandler(async (req, res, next) => {
  const { Course, Subscription, User } = req.db.course.models;
  const course = await Course.findByPk(req.params.id, {
    include: {
      model: Subscription,
      as: "subscriptions",
      include: {
        model: User,
        as: "user",
      },
    },
  });

  if (!course) {
    return next(new ErrorResponse(`Course not found`, 404));
  }

  const subscribedUsers = course.subscriptions.map(
    (subscription) => subscription.user,
  );

  res.status(200).json({
    success: true,
    data: subscribedUsers,
  });
});
