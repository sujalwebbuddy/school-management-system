'use strict';

const {
  getTeacherClass,
  newExam,
  getExams,
  deleteExam,
  updateExam,
  submitMark,
  getHomeworks,
  newHomework,
  deleteHomework,
  updateProfile,
} = require('../controllers/teacherControllers');
const express = require('express');
const multer = require('multer');
const { makePredictions } = require('../middlewares/personDetectMiddleware');
const { uploadFileToS3 } = require('../middlewares/s3UploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const { adminMiddleware } = require('../middlewares/authMiddleware');
const { requireFeature } = require('../middlewares/featureGatingMiddleware');
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.get("/myclass", authMiddleware, tenantMiddleware, getTeacherClass);
router.post("/newexam", authMiddleware, tenantMiddleware, adminMiddleware, requireFeature("exams"), newExam);
router.get("/allexams", authMiddleware, tenantMiddleware, requireFeature("exams"), getExams);
router.delete("/deleteExam/:examId", authMiddleware, tenantMiddleware, adminMiddleware, requireFeature("exams"), deleteExam);
router.put("/updateexam/:examId", authMiddleware, tenantMiddleware, adminMiddleware, requireFeature("exams"), updateExam);
router.put("/submitmarks", authMiddleware, tenantMiddleware, adminMiddleware, requireFeature("exams"), submitMark);

router.get("/allhomeworks", authMiddleware, tenantMiddleware, requireFeature("homework"), getHomeworks);
router.post("/newhomework", authMiddleware, tenantMiddleware, adminMiddleware, requireFeature("homework"), newHomework);
router.delete("/delete/:homeId", authMiddleware, tenantMiddleware, adminMiddleware, deleteHomework);
router.put(
  '/update/:userId',
  authMiddleware,
  tenantMiddleware,
  upload.single('image'),
  makePredictions,
  uploadFileToS3('profile-images'),
  updateProfile
);
module.exports = router;
