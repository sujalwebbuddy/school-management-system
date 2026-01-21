const {
  register,
  login,
  getUserData,
  getActiveOrganizations,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword,
} = require("../controllers/userControllers");

const { body } = require("express-validator");
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const tenantMiddleware = require("../middlewares/tenantMiddleware");
const router = express.Router();

router.post(
  "/register",
  body("email", "not a valid email").isEmail(),
  register
);
router.post("/login", login);
router.get("/organizations", getActiveOrganizations);
router.get("/", authMiddleware, tenantMiddleware, getUserData);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
