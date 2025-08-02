const asyncHandler = require("../middlewares/async");
const { Op } = require("sequelize");
const ErrorResponse = require("../utils/errorResponse");

exports.createParameter = asyncHandler(async (req, res, next) => {
  const { Parameter } = req.db.course.models;
  const parameter = await Parameter.create(req.body);
  res.status(201).json({
    success: true,
    data: parameter,
  });
});

exports.getParameters = asyncHandler(async (req, res, next) => {
  const { Parameter } = req.db.course.models;
  const where = {};
  if (req.user && req.user.role === "admin") {
    // No restrictions for admin
  } else if (req.user) {
    where.privacy = { [Op.in]: ["all", "user"] };
  } else {
    where.privacy = "all";
  }

  const parameters = await Parameter.findAll({ where });
  res.status(200).json({
    success: true,
    data: parameters,
  });
});

exports.getParameter = asyncHandler(async (req, res, next) => {
  const { Parameter } = req.db.course.models;
  const where = { key: req.params.key };
  if (req.user && req.user.role === "admin") {
    // No restrictions for admin
  } else if (req.user) {
    where.privacy = { [Op.in]: ["all", "user"] };
  } else {
    where.privacy = "all";
  }

  const parameter = await Parameter.findOne({ where });
  if (!parameter) {
    return next(new ErrorResponse(`Parameter not found`, 404));
  }
  res.status(200).json({
    success: true,
    data: parameter,
  });
});

exports.updateParameter = asyncHandler(async (req, res, next) => {
  const { Parameter } = req.db.course.models;
  let parameter = await Parameter.findOne({
    where: { key: req.params.key },
  });
  if (!parameter) {
    return next(new ErrorResponse(`Parameter not found`, 404));
  }
  parameter = await parameter.update(req.body);
  res.status(200).json({
    success: true,
    data: parameter,
  });
});

exports.deleteParameter = asyncHandler(async (req, res, next) => {
  const { Parameter } = req.db.course.models;
  const parameter = await Parameter.findOne({
    where: { key: req.params.key },
  });
  if (!parameter) {
    return next(new ErrorResponse(`Parameter not found`, 404));
  }
  await parameter.destroy();
  res.status(200).json({
    success: true,
    data: {},
  });
});
