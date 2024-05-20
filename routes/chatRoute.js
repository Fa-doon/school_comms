const express = require("express");
const {
  createChatroom,
  sendMessage,
  getChatMessagesByRoomId,
} = require("../controllers/chatController");
const { isUser } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/chatroom", createChatroom);
router.post("/messages", isUser, sendMessage);
router.get("/messages/:roomName", getChatMessagesByRoomId);

module.exports = router;
