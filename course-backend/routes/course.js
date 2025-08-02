
const express = require("express");
const upload = require("../configs/uploads");
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getSubscribedUsers,
} = require("../controllers/course");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(getCourses)
  .post(protect, authorize("admin"), upload.single("bannerImage"), createCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("admin"), upload.single("bannerImage"), updateCourse)
  .delete(protect, authorize("admin"), deleteCourse);

router.route("/:id/subscriptions").get(getSubscribedUsers);

module.exports = router;
