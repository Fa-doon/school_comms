const express = require("express");
const {
  createChatroom,
  sendMessage,
  getChatMessagesByRoomId,
  getAllChatrooms,
  deletemessageById,
} = require("../controllers/chatController");
const { decodeUser } = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(decodeUser);

router.post("/chatroom", decodeUser, createChatroom);
router.post("/messages", decodeUser, sendMessage);
router.get("/messages/:roomName", decodeUser, getChatMessagesByRoomId);
router.get("/user-chatrooms", decodeUser, getAllChatrooms);
router.delete("/delete-message/:id", decodeUser, deletemessageById);

module.exports = router;
