const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

exports.createExercise = asyncHandler(async (req, res, next) => {
  const { Exercise, Lesson } = req.db.course.models;
  const { lessonId } = req.params;
  const lesson = await Lesson.findByPk(lessonId);
  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found`, 404));
  }
  const exercise = await Exercise.create({ ...req.body, lessonId });
  res.status(201).json({
    success: true,
    data: exercise,
  });
});

exports.getExercises = asyncHandler(async (req, res, next) => {
  const { Exercise } = req.db.course.models;
  const exercises = await Exercise.findAll({
    where: { lessonId: req.params.lessonId },
  });
  res.status(200).json({
    success: true,
    data: exercises,
  });
});

exports.getExercise = asyncHandler(async (req, res, next) => {
  const { Exercise } = req.db.course.models;
  const exercise = await Exercise.findByPk(req.params.id);
  if (!exercise) {
    return next(new ErrorResponse(`Exercise not found`, 404));
  }
  res.status(200).json({
    success: true,
    data: exercise,
  });
});

exports.updateExercise = asyncHandler(async (req, res, next) => {
  const { Exercise } = req.db.course.models;
  let exercise = await Exercise.findByPk(req.params.id);
  if (!exercise) {
    return next(new ErrorResponse(`Exercise not found`, 404));
  }
  exercise = await exercise.update(req.body);
  res.status(200).json({
    success: true,
    data: exercise,
  });
});

exports.deleteExercise = asyncHandler(async (req, res, next) => {
  const { Exercise } = req.db.course.models;
  const exercise = await Exercise.findByPk(req.params.id);
  if (!exercise) {
    return next(new ErrorResponse(`Exercise not found`, 404));
  }
  await exercise.destroy();
  res.status(200).json({
    success: true,
    data: {},
  });
});
