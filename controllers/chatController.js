const { Chatroom, Chatmessage, User, Sequelize } = require("../models");
// const { v4: uuidv4 } = require("uuid");

// Create chat room
const createChatroom = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    const sortedUsersIds = [senderId, receiverId].sort((a, b) => a - b);
    const [sortedSenderId, sortedReceiverId] = sortedUsersIds;

    let chatroom = await Chatroom.findOne({
      where: {
        sender_id: sortedSenderId,
        receiver_id: sortedReceiverId,
      },
    });

    if (!chatroom) {
      const roomName = `Room_${sortedSenderId}_${sortedReceiverId}`;

      chatroom = await Chatroom.create({
        name: roomName,
        sender_id: sortedSenderId,
        receiver_id: sortedReceiverId,
      });
    } else {
      return res.status(200).json({
        message: "Chatroom already exists",
        chatroom,
      });
    }

    res.status(201).json({ message: "Chat initiated successfully", chatroom });
  } catch (error) {
    console.log("Error initiating chat:", error);
    res.status(500).json({ error: "Failed to initiate chat" });
  }
};

//Create a new chat message
const sendMessage = async (req, res) => {
  try {
    const { roomName, senderId, receiverId, message } = req.body;

    let chatroom = await Chatroom.findOne({ where: { name: roomName } });
    if (!chatroom) {
      return res.status(200).json({ error: "Chatroom not found" });
    }

    if (
      chatroom.sender_id !== senderId ||
      chatroom.receiver_id !== receiverId
    ) {
      return res
        .status(400)
        .json({ error: "Invalid sender or receiver for this chatroom" });
    }

    const chatMessage = await Chatmessage.create({
      room_id: roomName,
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
    });

    res.status(201).json({ message: "Message sent successfully", chatMessage });
  } catch (error) {
    console.log("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Retrieve chat messages for a given room ID
const getChatMessagesByRoomId = async (req, res) => {
  try {
    const { roomName } = req.params;

    const chatroom = await Chatroom.findOne({ where: { name: roomName } });
    if (!chatroom) {
      return res.status(200).json({ error: "Chatroom not found" });
    }

    const messages = await Chatmessage.findAll({
      where: { room_id: roomName },
      include: [
        { model: User, as: "sender", attributes: ["id", "name"] },
        { model: User, as: "receiver", attributes: ["id", "name"] },
      ],
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.log("Error retrieving messages:", error);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

// Get all chatrooms for a particular user
const getAllChatrooms = async (req, res) => {
  try {
    const userID = req.user.id;

    const chatrooms = await Chatroom.findAll({
      where: {
        [Sequelize.Op.or]: [{ sender_id: userID }, { receiver_id: userID }],
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "username", "email"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "name", "username", "email"],
        },
      ],
    });

    if (chatrooms.length === 0) {
      return res.status(200).json({
        userChatrooms: [],
      });
    }

    const userChatrooms = chatrooms.map((chatroom) => {
      const otherUser =
        chatroom.sender_id === userID ? chatroom.receiver : chatroom.sender;
      return {
        roomName: chatroom.name,
        user: otherUser,
      };
    });

    res.status(200).json({ userChatrooms });
  } catch (error) {
    console.log("Error retrieving chatrooms:", error);
    res.status(500).json({ error: "Failed to retrieve chatrooms" });
  }
};

// const updateMessage = async (req, res) => {
//   const messageId = req.params.id
//   const userId = req.user.id

// };

const deletemessageById = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    const message = await Chatmessage.findOne({ where: { id: messageId } });
    if (!message) {
      return res.status(200).json({ message: "Message not found" });
    }

    if (message.sender_id !== userId) {
      return res.status(403).json({ error: "You cannot delete this message" });
    }

    await message.destroy();

    req.io.to(message.room_id).emit("messageDeleted", { messageId });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

module.exports = {
  createChatroom,
  sendMessage,
  getChatMessagesByRoomId,
  getAllChatrooms,
  deletemessageById,
};
