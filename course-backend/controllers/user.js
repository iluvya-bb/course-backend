const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const upload = require("../configs/uploads");

exports.register = asyncHandler(async (req, res, next) => {
	const { username, email, password } = req.body;
	const { User } = req.db.course.models;

	const user = await User.create({
		username,
		email,
		password,
	});

	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});

	res.status(200).json({ success: true, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password, deviceType } = req.body;
  const { User, Session } = req.db.course.models;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  try {
    const deviceId = uuidv4();
    const token = jwt.sign({ id: user.id, deviceId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Invalidate all other sessions for this user
    await Session.update({ sessionToken: null }, { where: { userId: user.id } });

    // Create a new session for the new device
    const newSession = await Session.create({
      userId: user.id,
      deviceId,
      deviceType,
      sessionToken: token,
    });

    res.cookie("token", token, {
      maxAge: process.env.JWT_EXPIRE,
      httpOnly: true,
    });

    res.status(200).json({ success: true, token });
  } catch {
    return next(new ErrorResponse("Something is wrong", 500));
  }
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { User } = req.db.course.models;
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }

  if (req.file) {
    req.body.avatar = req.file.path;
  }

  const updatedUser = await user.update(req.body);

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

exports.signout = asyncHandler(async (req, res, next) => {
  const { Session } = req.db.course.models;
  await Session.destroy({ where: { userId: req.user.id } });
  res.clearCookie("token");
  res.status(200).json({ success: true, data: {} });
});

exports.subscribeUserToCourse = asyncHandler(async (req, res, next) => {
	const { userId, courseId } = req.body;

	const { User, Course, Subscription } = req.db.course.models;

	const user = await User.findByPk(userId);
	if (!user) {
		return next(new ErrorResponse(`User not found with id of ${userId}`, 404));
	}

	const course = await Course.findByPk(courseId);
	if (!course) {
		return next(
			new ErrorResponse(`Course not found with id of ${courseId}`, 404),
		);
	}

	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 30);

	const subscription = await Subscription.create({
		userId,
		courseId,
		endDate,
    purchasePrice: course.price,
	});

	res.status(201).json({
		success: true,
		data: subscription,
	});
});

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
  const { User } = req.db.course.models;
  const users = await User.findAll();
  res.status(200).json({ success: true, data: users });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private (Admin)
exports.getUser = asyncHandler(async (req, res, next) => {
  const { User } = req.db.course.models;
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }
  res.status(200).json({ success: true, data: user });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { User } = req.db.course.models;
  let user = await User.findByPk(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }
  user = await user.update(req.body);
  res.status(200).json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { User } = req.db.course.models;
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }
  await user.destroy();
  res.status(200).json({ success: true, data: {} });
});
