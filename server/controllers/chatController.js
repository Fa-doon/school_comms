const { Chatroom, Chatmessage, User } = require("../models");

// Function to generate room name
const generateRoomName = (userId, recipientId) => {
  const sortedUserIds = [userId, recipientId].sort((a, b) => a - b);
  const roomName = `Room_${sortedUserIds.join("_")}`;

  return roomName;
};

// Create chat room
const createChatroom = async (userId, recipientId) => {
  try {
    const roomName = generateRoomName(userId, recipientId);
    const chatroom = await Chatroom.create({ name: roomName });

    return chatroom;
  } catch (error) {
    console.log("Error creating chatroom", error);
    throw new Error("Failed to create chatroom");
  }
};

//Create a new chat message
const createChatMessage = async (roomId, senderId, receiverId, message) => {
  try {
    const chatMessage = await Chatmessage.create({
      room_id: roomId,
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
    });

    return chatMessage;
  } catch (error) {
    throw new Error("Failed to create chat message");
  }
};

// Retrieve chat messages for a given room ID
const getChatMessagesByRoomId = async (roomId) => {
  try {
    const chatMessages = await Chatmessage.findAll({
      where: { room_id: roomId },
      include: [
        { model: User, as: "sender" },
        { model: User, as: "receiver" },
      ],
    });

    return chatMessages;
  } catch (error) {
    throw new Error("Failed to retrieve chat messages");
  }
};

module.exports = {
  createChatroom,
  createChatMessage,
  getChatMessagesByRoomId,
};
