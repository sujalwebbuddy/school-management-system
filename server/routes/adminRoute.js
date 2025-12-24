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
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post("/newAdmin", authMiddleware, tenantMiddleware, addNewAdmin);
router.get("/pendedusers", authMiddleware, tenantMiddleware, getPendedUsers);
router.post("/newUser", authMiddleware, tenantMiddleware, addNewUser);
router.delete("/deleteUser/:userId", authMiddleware, tenantMiddleware, deletePendedUsers);

router.get("/students", authMiddleware, tenantMiddleware, getAllStudents);
router.put('/user/update/:userId', authMiddleware, tenantMiddleware, upload.single('profile-image'), uploadFileToS3('profile-images'), updateUser);
router.get("/user/view/:userId", authMiddleware, tenantMiddleware, getUser);
router.delete("/user/:userId", authMiddleware, tenantMiddleware, deleteUser);

router.get("/number", authMiddleware, tenantMiddleware, getNumberUsers);

router.post("/newclass", authMiddleware, tenantMiddleware, addNewClass);
router.get("/class", authMiddleware, tenantMiddleware, getAllClasses);
router.delete("/class/:userId", authMiddleware, tenantMiddleware, deleteClass);
router.put("/class/update/:userId", authMiddleware, tenantMiddleware, updateClass);

router.post("/newsubject", authMiddleware, tenantMiddleware, assignNewSubject);
router.get("/userInfo", authMiddleware, tenantMiddleware, getUserInfo);
router.get("/attendance", authMiddleware, tenantMiddleware, getAttendance);
router.post("/attendance", authMiddleware, tenantMiddleware, submitAttendance);

// Analytics routes
router.get("/analytics/registration-trends", authMiddleware, tenantMiddleware, getUserRegistrationTrends);
router.get("/analytics/subscription", authMiddleware, tenantMiddleware, getSubscriptionAnalytics);
router.get("/analytics/educational", authMiddleware, tenantMiddleware, getEducationalAnalytics);
router.get("/analytics/dashboard", authMiddleware, tenantMiddleware, getDashboardAnalytics);

module.exports = router;
