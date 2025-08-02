const { uploadLocalFile, getSignedUrlForFile } = require("../utils/bucket");
const fs = require("fs");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const { compressVideo } = require("../services/videoService");
const upload = require("../configs/uploads");

exports.createLesson = asyncHandler(async (req, res, next) => {
  const { Course, Lesson } = req.db.course.models;
  const { courseId } = req.params;
  const course = await Course.findByPk(courseId);
  if (!course) {
    return next(new ErrorResponse(`Course not found`, 404));
  }

  const { title, content, wysiwygContent } = req.body;
  const videoPath = req.files.video ? req.files.video[0].path : null;
  const bannerImage = req.files.bannerImage
    ? req.files.bannerImage[0].path
    : null;

  if (videoPath) {
    const compressedVideoPath = `./uploads/compressed-${req.files.video[0].filename}`;
    await compressVideo(videoPath, compressedVideoPath);

    const s3Key = `videos/${courseId}/${req.files.video[0].filename}`;
    await uploadLocalFile(compressedVideoPath, s3Key);

    fs.unlinkSync(videoPath); // Clean up original upload
    fs.unlinkSync(compressedVideoPath); // Clean up compressed file

    const lesson = await Lesson.create({
      title,
      content,
      wysiwygContent,
      courseId,
      videoPath: s3Key,
      bannerImage,
    });

    res.status(201).json({
      success: true,
      data: lesson,
    });
  } else {
    const lesson = await Lesson.create({
      title,
      content,
      wysiwygContent,
      courseId,
      bannerImage,
    });
    res.status(201).json({
      success: true,
      data: lesson,
    });
  }
});

exports.getLessons = asyncHandler(async (req, res, next) => {
  const { Lesson } = req.db.course.models;
  const lessons = await Lesson.findAll({
    where: { courseId: req.params.courseId },
  });

  res.status(200).json({
    success: true,
    data: lessons,
  });
});

exports.getLesson = asyncHandler(async (req, res, next) => {
  const { Lesson } = req.db.course.models;

  const lesson = await Lesson.findByPk(req.params.id);
  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: lesson,
  });
});

exports.updateLesson = asyncHandler(async (req, res, next) => {
  const { Lesson } = req.db.course.models;
  let lesson = await Lesson.findByPk(req.params.id);

  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found`, 404));
  }
  if (req.files.bannerImage) {
    req.body.bannerImage = req.files.bannerImage[0].path;
  }
  lesson = await lesson.update(req.body);
  res.status(200).json({
    success: true,
    data: lesson,
  });
});

exports.deleteLesson = asyncHandler(async (req, res, next) => {
  const { Lesson } = req.db.course.models;
  const lesson = await Lesson.findByPk(req.params.id);
  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found`, 404));
  }
  await lesson.destroy();
  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.streamVideo = asyncHandler(async (req, res, next) => {
  const { Subscription, Lesson } = req.db.course.models;
  const lesson = await Lesson.findByPk(req.params.id);
  if (!lesson || !lesson.videoPath) {
    return next(new ErrorResponse(`Video not found`, 404));
  }

  const subscription = await Subscription.findOne({
    where: { userId: req.user.id, courseId: lesson.courseId },
  });

  if (!subscription) {
    return next(new ErrorResponse(`Not authorized to view this video`, 403));
  }

  const signedUrl = await getSignedUrlForFile(lesson.videoPath);

  res.status(200).json({
    success: true,
    data: signedUrl,
  });
});
