const {
  // login, // Commented out - unused endpoint, redundant with main login system
  getAllUsers,
  setAvatar,
  logOut,
} = require("../controllers/userMsgControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const tenantMiddleware = require("../middlewares/tenantMiddleware");

const router = require("express").Router();

// router.post("/login", login); // Commented out - unused endpoint

router.get("/allusers/:id", authMiddleware, tenantMiddleware, getAllUsers);
router.post("/setavatar/:id", authMiddleware, tenantMiddleware, setAvatar);
router.get("/logout/:id", authMiddleware, tenantMiddleware, logOut);

module.exports = router;
