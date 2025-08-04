
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");

exports.extendToken = asyncHandler(async (req, res, next) => {
  const { User, Session } = req.db.course.models;
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({
      where: { userId: decoded.id, deviceId: decoded.deviceId },
    });

    if (!session || session.sessionToken !== token) {
      res.clearCookie("token");
      return next();
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next();
    }

    req.user = user;

    const newToken = jwt.sign(
      { id: decoded.id, deviceId: decoded.deviceId },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    await session.update({ sessionToken: newToken });

    res.cookie("token", newToken, {
      maxAge: process.env.JWT_EXPIRE,
      httpOnly: true,
    });

    next();
  } catch (err) {
    return next();
  }
});
