
const express = require("express");
const {
  createExercise,
  getExercises,
  getExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/exercise");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getExercises)
  .post(protect, authorize("admin"), createExercise);

router
  .route("/:id")
  .get(getExercise)
  .put(protect, authorize("admin"), updateExercise)
  .delete(protect, authorize("admin"), deleteExercise);

module.exports = router;
