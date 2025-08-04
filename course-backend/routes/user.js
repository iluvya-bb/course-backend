const express = require("express");
const {
  subscribeUserToCourse,
  register,
  login,
  signout,
  updateProfile,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const upload = require("../configs/uploads");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin"), getUsers);

router
  .route("/:id")
  .get(protect, authorize("admin"), getUser)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/signout").get(protect, signout);
router.route("/profile").put(protect, upload.single("avatar"), updateProfile);
router
  .route("/subscribe")
  .post(protect, authorize("admin"), subscribeUserToCourse);

module.exports = router;
