
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

exports.createTeacher = asyncHandler(async (req, res, next) => {
  const { Teacher } = req.db.course.models;
  if (req.file) {
    req.body.avatar = req.file.path;
  }
  const teacher = await Teacher.create(req.body);
  res.status(201).json({
    success: true,
    data: teacher,
  });
});

exports.getTeachers = asyncHandler(async (req, res, next) => {
  const { Teacher } = req.db.course.models;
  const teachers = await Teacher.findAll();
  res.status(200).json({
    success: true,
    data: teachers,
  });
});

exports.getTeacher = asyncHandler(async (req, res, next) => {
  const { Teacher, Course } = req.db.course.models;
  const teacher = await Teacher.findByPk(req.params.id, {
    include: {
      model: Course,
      as: "courses",
    },
  });

  if (!teacher) {
    return next(new ErrorResponse(`Teacher not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: teacher,
  });
});

exports.updateTeacher = asyncHandler(async (req, res, next) => {
  const { Teacher } = req.db.course.models;
  let teacher = await Teacher.findByPk(req.params.id);
  if (!teacher) {
    return next(new ErrorResponse(`Teacher not found`, 404));
  }
  if (req.file) {
    req.body.avatar = req.file.path;
  }
  teacher = await teacher.update(req.body);
  res.status(200).json({
    success: true,
    data: teacher,
  });
});

exports.deleteTeacher = asyncHandler(async (req, res, next) => {
  const { Teacher } = req.db.course.models;
  const teacher = await Teacher.findByPk(req.params.id);
  if (!teacher) {
    return next(new ErrorResponse(`Teacher not found`, 404));
  }
  await teacher.destroy();
  res.status(200).json({
    success: true,
    data: {},
  });
});
