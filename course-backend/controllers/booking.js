const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create a booking request
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
	const { Booking } = req.db.course.models;
	req.body.userId = req.user.id;
	const booking = await Booking.create(req.body);
	res.status(201).json({
		success: true,
		data: booking,
	});
});

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private (Admin)
exports.getBookings = asyncHandler(async (req, res, next) => {
	const { Booking } = req.db.course.models;
	const bookings = await Booking.findAll();
	res.status(200).json({
		success: true,
		data: bookings,
	});
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
	const { Booking, Teacher } = req.db.course.models;
	const booking = await Booking.findByPk(req.params.id);

	if (!booking) {
		return next(new ErrorResponse(`Booking not found`, 404));
	}

	// Ensure user is the creator or the assigned teacher
	const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
	if (
		booking.userId !== req.user.id &&
		(!teacher || booking.teacherId !== teacher.id)
	) {
		return next(new ErrorResponse(`Not authorized to view this booking`, 401));
	}

	res.status(200).json({
		success: true,
		data: booking,
	});
});

// @desc    Accept a booking (for teachers)
// @route   PUT /api/v1/bookings/:id/accept
// @access  Private (Teacher)
exports.acceptBooking = asyncHandler(async (req, res, next) => {
	const { Booking, Teacher } = req.db.course.models;
	const { price } = req.body;
	let booking = await Booking.findByPk(req.params.id);

	if (!booking) {
		return next(new ErrorResponse(`Booking not found`, 404));
	}

	// Ensure the user is a teacher and is the assigned teacher for this booking
	const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
	if (!teacher || booking.teacherId !== teacher.id) {
		return next(
			new ErrorResponse(`Not authorized to accept this booking`, 401),
		);
	}

	// Ensure booking is in the correct state
	if (booking.status !== "pending") {
		return next(
			new ErrorResponse(`Booking cannot be accepted as it is not pending`, 400),
		);
	}

	booking = await booking.update({ status: "accepted", price });
	res.status(200).json({
		success: true,
		data: booking,
	});
});

// @desc    Pay for a booking (for users)
// @route   PUT /api/v1/bookings/:id/pay
// @access  Private
exports.payForBooking = asyncHandler(async (req, res, next) => {
	const { Booking } = req.db.course.models;
	let booking = await Booking.findByPk(req.params.id);

	if (!booking) {
		return next(new ErrorResponse(`Booking not found`, 404));
	}

	// Ensure user is the creator of the booking
	if (booking.userId !== req.user.id) {
		return next(
			new ErrorResponse(`Not authorized to pay for this booking`, 401),
		);
	}

	// Ensure booking is in the correct state
	if (booking.status !== "accepted") {
		return next(
			new ErrorResponse(
				`Booking cannot be paid for as it has not been accepted`,
				400,
			),
		);
	}

	// Mock payment logic
	console.log(
		`Simulating payment for booking ${booking.id} with price ${booking.price}`,
	);

	booking = await booking.update({ status: "paid" });
	res.status(200).json({
		success: true,
		data: booking,
	});
});

// @desc    Cancel a booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res, next) => {
	const { Booking, Teacher } = req.db.course.models;
	let booking = await Booking.findByPk(req.params.id);

	if (!booking) {
		return next(new ErrorResponse(`Booking not found`, 404));
	}

	// Ensure user is the creator or the assigned teacher
	const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
	if (
		booking.userId !== req.user.id &&
		(!teacher || booking.teacherId !== teacher.id)
	) {
		return next(
			new ErrorResponse(`Not authorized to cancel this booking`, 401),
		);
	}

	booking = await booking.update({ status: "cancelled" });
	res.status(200).json({
		success: true,
		data: booking,
	});
});
