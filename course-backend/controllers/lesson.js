const {
	uploadLocalFile,
	getSignedUrlForFile,
	deleteFile,
	uploadDirectory,
	deleteDirectory,
} = require("../utils/bucket");
const fs = require("fs");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const { transcodeVideo } = require("../services/transcodeService");
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
		console.log("New video found, starting upload process...");
		const outputDir = `./uploads/transcoded/${Date.now()}`;
		await transcodeVideo(videoPath, outputDir);

		const s3Key = `videos/${courseId}/${path.basename(outputDir)}`;
		await uploadDirectory(outputDir, s3Key);

		fs.unlinkSync(videoPath); // Clean up original upload
		fs.rmSync(outputDir, { recursive: true }); // Clean up transcoded files

		const lesson = await Lesson.create({
			title,
			content,
			wysiwygContent,
			courseId,
			videoPath: `${s3Key}/master.m3u8`,
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

	// Handle banner image update
	if (req.files.bannerImage) {
		req.body.bannerImage = req.files.bannerImage[0].path;
	}

	// Handle video update
	if (req.files.video) {
		console.log("New video found for update, starting upload process...");
		const videoPath = req.files.video[0].path;
		const outputDir = `./uploads/transcoded/${Date.now()}`;
		await transcodeVideo(videoPath, outputDir);

		const s3Key = `videos/${lesson.courseId}/${path.basename(outputDir)}`;
		await uploadDirectory(outputDir, s3Key);

		fs.unlinkSync(videoPath); // Clean up original upload
		fs.rmSync(outputDir, { recursive: true }); // Clean up transcoded files

		// Delete old video if it exists
		if (lesson.videoPath) {
			const oldS3Key = lesson.videoPath.replace("/master.m3u8", "");
			await deleteDirectory(oldS3Key);
		}

		req.body.videoPath = `${s3Key}/master.m3u8`;
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
