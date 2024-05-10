const express = require("express");
const {
  createChatroom,
  sendMessage,
  getChatMessagesByRoomId,
} = require("../controllers/chatController");
const router = express.Router();

router.post("/chatroom", createChatroom);
router.post("/messages", sendMessage);
router.get("/messages/:roomName", getChatMessagesByRoomId);

module.exports = router;
