const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const users = await User.find({
      _id: { $ne: req.params.id },
      organizationId: req.organization._id
    }).select([
      "email",
      "firstName",
      "lastName",
      "role",
      "avatarImage",
      "_id",
    ]);

    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const userId = req.params.id;
    const avatarImage = req.body.image;

    const userData = await User.findOneAndUpdate(
      {
        _id: userId,
        organizationId: req.organization._id
      },
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );

    if (!userData) {
      return res.status(404).json({ msg: "User not found in your organization" });
    }

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
