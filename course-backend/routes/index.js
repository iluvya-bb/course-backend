const express = require("express");
const courseRoutes = require("./course");
const lessonRoutes = require("./lesson");
const exerciseRoutes = require("./exercise");
const subscriptionRoutes = require("./subscription");
const userRoutes = require("./user");
const statsRoutes = require("./stats");
const parameterRoutes = require("./parameter");

const router = express.Router();

router.use("/courses", courseRoutes);
router.use("/lessons", lessonRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/users", userRoutes);
router.use("/stats", statsRoutes);
router.use("/parameters", parameterRoutes);


module.exports = router;
