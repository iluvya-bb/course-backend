const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("./async");

exports.protect = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
  next();
});

exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`User role ${req.user.role} is not authorized to access this route`,
					403,
				),
			);
		}
		next();
	};
};

exports.tokenParsing = asyncHandler(async (req, res, next) => {
	let token = "";
	if (req.cookies && req.cookies.token) {
		token = req.cookies.token;
	} else {
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		}
	}
	req.token = token;
	next();
});

exports.extendToken = asyncHandler(async (req, res, next) => {
	const token = req.token;

	if (!token) {
		return next();
	}

	try {
		const { User } = req.db.course.models;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findByPk(decoded.id);
		if (!user || user.sessionToken !== token) {
			return next();
		}
		const newToken = user.getSignedJwtToken(); // Generate a fresh token
		await user.update({ sessionToken: newToken });
		const options = {
			expires: new Date(
				Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
			),
			httpOnly: true,
			sameSite: "strict",
		};

		res.cookie("token", newToken, options);

		req.user = user;
		req.role = user.role;
		req.authenthicated = true;

		next();
	} catch (err) {
		res.clearCookie("token");
		req.authenthicated = false;
		next();
	}
});
