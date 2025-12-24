const {
  addMessage,
  getMessages,
} = require("../controllers/messageControllers");
const authMiddleware = require('../middlewares/authMiddleware');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const router = require("express").Router();

router.post("/addmsg/", authMiddleware, tenantMiddleware, addMessage);
router.post("/getmsg/", authMiddleware, tenantMiddleware, getMessages);

module.exports = router;
