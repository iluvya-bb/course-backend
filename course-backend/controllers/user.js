const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
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
	const { email, password } = req.body;
	const { User } = req.db.course.models;

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
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRE,
		});

		await user.update({ sessionToken: token });

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
	await req.user.update({ sessionToken: null });
	res.clearCookie();
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
	});

	res.status(201).json({
		success: true,
		data: subscription,
	});
});
