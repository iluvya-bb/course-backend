
const express = require("express");
const {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacher");
const { protect, authorize } = require("../middlewares/auth");
const upload = require("../configs/uploads");

const router = express.Router();

router
  .route("/")
  .get(getTeachers)
  .post(protect, authorize("admin"), upload.single("avatar"), createTeacher);

router
  .route("/:id")
  .get(getTeacher)
  .put(protect, authorize("admin"), upload.single("avatar"), updateTeacher)
  .delete(protect, authorize("admin"), deleteTeacher);

module.exports = router;
