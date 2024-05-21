const express = require("express");
const {
  createChatroom,
  sendMessage,
  getChatMessagesByRoomId,
  getAllChatrooms,
} = require("../controllers/chatController");
const { isUser, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/chatroom", isUser, createChatroom);
router.post("/messages", isUser, sendMessage);
router.get("/messages/:roomName", getChatMessagesByRoomId);
router.get("/user-chatrooms", isUser, getAllChatrooms);
router.get("/admin-chatrooms", isAdmin, getAllChatrooms);

module.exports = router;
