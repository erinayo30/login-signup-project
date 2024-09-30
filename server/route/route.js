const express = require("express");
const {
  createUser,
  signin,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/createUser");
const { validateUser, validate } = require("../middleware/validator");
const { isResetTokenValid } = require("../middleware/resetToken");
const router = express.Router();

router.post("/create", validateUser, validate, createUser);
router.post("/signin", signin);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", isResetTokenValid, resetPassword);
module.exports = router;
