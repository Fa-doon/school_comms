const express = require("express");
const {
  createChatroom,
  sendMessage,
  getChatMessagesByRoomId,
  getAllChatrooms,
} = require("../controllers/chatController");
const {
  isUser,
  isAdmin,
  decodeUser,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/chatroom", decodeUser, createChatroom);
router.post("/messages", decodeUser, sendMessage);
router.get("/messages/:roomName", decodeUser, getChatMessagesByRoomId);
router.get("/user-chatrooms", decodeUser, getAllChatrooms);
// router.get("/admin-chatrooms", isAdmin, getAllChatrooms);

module.exports = router;
