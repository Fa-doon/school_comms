const express = require("express");
const {
  createChatroom,
  sendMessage,
  getChatMessagesByRoomId,
  getAllChatrooms,
} = require("../controllers/chatController");
const { isUser } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/chatroom", createChatroom);
router.post("/messages", isUser, sendMessage);
router.get("/messages/:roomName", getChatMessagesByRoomId);
router.get("/user-chatrooms", isUser, getAllChatrooms);

module.exports = router;
