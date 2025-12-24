const {
  register,
  login,
  getUserData,
  getActiveOrganizations,
} = require("../controllers/userControllers");

const { body, validationResult } = require("express-validator");
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

module.exports = router;
