const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const config = require("../config/envConfig");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email, isApproved: true }).select("+password");
    if (!existUser)
      return res.status(404).json({ msg: "you should register first" });
    if (!existUser.password)
      return res.status(401).json({ msg: "account not properly set up" });
    const verifyPassword = await bcrypt.compare(password, existUser.password);
    if (!verifyPassword)
      return res.status(401).json({ msg: "password is incorrect" });

    const userInfo = await User.findById(existUser._id)
      .select("-password")
      .populate("classIn")
      .populate("subject");

    const token = await jwt.sign(
      { sub: existUser._id },
      config.JWT_SECRET
    );
    res.json({ success: true, token, userInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, role, phoneNumber } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(404).json({ msg: "email already exists" });

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      role,
      phoneNumber,
      isApproved: false,
    });
    res.json({ msg: "register request sent successfully", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId })
      .select("-password")
      .populate("classIn")
      .populate("subject");
    if (!user) return res.status(401).json({ msg: "you are not authorized" });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};
