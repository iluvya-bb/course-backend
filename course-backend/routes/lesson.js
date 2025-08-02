
const express = require("express");
const upload = require("../configs/uploads");
const {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  streamVideo,
} = require("../controllers/lesson");
const { protect, authorize } = require("../middlewares/auth");
const upload = require("../configs/upload");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getLessons)
  .post(
    protect,
    authorize("admin"),
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "bannerImage", maxCount: 1 },
    ]),
    createLesson,
  );

router
  .route("/:id")
  .get(getLesson)
  .put(
    protect,
    authorize("admin"),
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "bannerImage", maxCount: 1 },
    ]),
    updateLesson,
  )
  .delete(protect, authorize("admin"), deleteLesson);

router.route("/:id/stream").get(protect, streamVideo);

module.exports = router;
