'use strict';

const express = require('express');
const multer = require('multer');
const {
  getPendedUsers,
  addNewUser,
  deletePendedUsers,
  getAllStudents,
  updateUser,
  getUser,
  deleteUser,
  getNumberUsers,
  addNewClass,
  getAllClasses,
  deleteClass,
  updateClass,
  assignNewSubject,
  getUserInfo,
  addNewAdmin,
  submitAttendance,
  getAttendance,
  getUserRegistrationTrends,
  getSubscriptionAnalytics,
  getEducationalAnalytics,
  getDashboardAnalytics,
} = require('../controllers/adminControllers');
const { uploadFileToS3 } = require('../middlewares/s3UploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const { adminMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post("/newAdmin", authMiddleware, tenantMiddleware, adminMiddleware, addNewAdmin);
router.get("/pendedusers", authMiddleware, tenantMiddleware, getPendedUsers);
router.post("/newUser", authMiddleware, tenantMiddleware, adminMiddleware, addNewUser);
router.delete("/deleteUser/:userId", authMiddleware, tenantMiddleware, adminMiddleware, deletePendedUsers);

router.get("/students", authMiddleware, tenantMiddleware, getAllStudents);
router.put('/user/update/:userId', authMiddleware, tenantMiddleware, adminMiddleware, upload.single('profile-image'), uploadFileToS3('profile-images'), updateUser);
router.get("/user/view/:userId", authMiddleware, tenantMiddleware, getUser);
router.delete("/user/:userId", authMiddleware, tenantMiddleware, adminMiddleware, deleteUser);

router.get("/number", authMiddleware, tenantMiddleware, getNumberUsers);

router.post("/newclass", authMiddleware, tenantMiddleware, adminMiddleware, addNewClass);
router.get("/class", authMiddleware, tenantMiddleware, getAllClasses);
router.delete("/class/:userId", authMiddleware, tenantMiddleware, adminMiddleware, deleteClass);
router.put("/class/update/:userId", authMiddleware, tenantMiddleware, adminMiddleware, updateClass);

router.post("/newsubject", authMiddleware, tenantMiddleware, adminMiddleware, assignNewSubject);
router.get("/userInfo", authMiddleware, tenantMiddleware, getUserInfo);
router.get("/attendance", authMiddleware, tenantMiddleware, getAttendance);
router.post("/attendance", authMiddleware, tenantMiddleware, adminMiddleware, submitAttendance);

// Analytics routes
router.get("/analytics/registration-trends", authMiddleware, tenantMiddleware, adminMiddleware, getUserRegistrationTrends);
router.get("/analytics/subscription", authMiddleware, tenantMiddleware, adminMiddleware, getSubscriptionAnalytics);
router.get("/analytics/educational", authMiddleware, tenantMiddleware, adminMiddleware, getEducationalAnalytics);
router.get("/analytics/dashboard", authMiddleware, tenantMiddleware, adminMiddleware, getDashboardAnalytics);

module.exports = router;
