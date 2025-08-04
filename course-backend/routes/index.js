const express = require("express");
const courseRoutes = require("./course");
const lessonRoutes = require("./lesson");
const exerciseRoutes = require("./exercise");
const subscriptionRoutes = require("./subscription");
const userRoutes = require("./user");
const statsRoutes = require("./stats");
const parameterRoutes = require("./parameter");
const teacherRoutes = require("./teacher");
const bookingRoutes = require("./booking");
const meRoutes = require("./me");

const router = express.Router();

router.use("/courses", courseRoutes);
router.use("/lessons", lessonRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/users", userRoutes);
router.use("/stats", statsRoutes);
router.use("/parameters", parameterRoutes);
router.use("/teachers", teacherRoutes);
router.use("/bookings", bookingRoutes);
router.use("/me", meRoutes);


module.exports = router;
