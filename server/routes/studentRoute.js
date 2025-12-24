const express = require("express");
const {
  studentClass,
  getTeachers,
  getHomeworks,
  getExams,
} = require("../controllers/studentControllers");
const authMiddleware = require('../middlewares/authMiddleware');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const { requireFeature } = require('../middlewares/featureGatingMiddleware');
const router = express.Router();

router.get("/getStudentClass", authMiddleware, tenantMiddleware, studentClass);
router.get("/teachers", authMiddleware, tenantMiddleware, getTeachers);
router.get("/homework", authMiddleware, tenantMiddleware, requireFeature("homework"), getHomeworks);
router.get("/exam", authMiddleware, tenantMiddleware, requireFeature("exams"), getExams);
module.exports = router;
