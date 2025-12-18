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
} = require('../controllers/adminControllers');
const { uploadFileToS3 } = require('../middlewares/s3UploadMiddleware');
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post("/newAdmin", addNewAdmin);
router.get("/pendedusers", getPendedUsers);
router.post("/newUser", addNewUser);
router.delete("/deleteUser/:userId", deletePendedUsers);

router.get("/students", getAllStudents);
router.put('/user/update/:userId', upload.single('profile-image'), uploadFileToS3('profile-images'), updateUser);
router.get("/user/view/:userId", getUser);
router.delete("/user/:userId", deleteUser);

router.get("/number", getNumberUsers);

router.post("/newclass", addNewClass);
router.get("/class", getAllClasses);
router.delete("/class/:userId", deleteClass);
router.put("/class/update/:userId", updateClass);

router.post("/newsubject", assignNewSubject);
router.get("/userInfo", getUserInfo);
router.get("/attendance", getAttendance);
router.post("/attendance", submitAttendance);

module.exports = router;
