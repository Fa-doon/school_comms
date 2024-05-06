const express = require("express");
require("dotenv").config();
const { connectToDB } = require("./config/db");
const http = require("http");
const path = require("path");
const socket = require("socket.io");

// Importing routes
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

const chatController = require("./controllers/chatController");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", authRoute);
app.use("/api/users", userRoute);

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Connection to DB
connectToDB();

// Socket connection
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on(
    "sendMessage",
    async ({ roomId, senderId, receiverId, message }) => {
      try {
        const chatMessage = await chatController.createChatMessage(
          roomId,
          senderId,
          receiverId,
          message
        );
        io.to(roomId).emit("receiveMessage", chatMessage);
      } catch (error) {
        socket.emit("sendMessageError", { message: error.message });
      }
    }
  );

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  // socket.on(
  //   "sendMessage",
  //   async ({ roomId, senderId, receiverId, message }) => {
  //     try {
  //       const chatMessage = await chatController.createChatMessage(
  //         roomId,
  //         senderId,
  //         receiverId,
  //         message
  //       );
  //       io.to(roomId).emit("receiveMessage", chatMessage);
  //       console.log(roomId, senderId, receiverId, message);
  //     } catch (error) {
  //       socket.emit("sendMessageError", { message: error.message });
  //     }
  //   }
  // );

  // // Handle getChatMessages event
  // socket.on("getChatMessages", async ({ roomId }) => {
  //   try {
  //     const chatMessages = await chatController.getChatMessagesByRoomId(roomId);
  //     socket.emit("receiveChatMessages", chatMessages);
  //   } catch (error) {
  //     socket.emit("getChatMessagesError", { message: error.message });
  //   }
  // });

  // // Handle createChatroom event
  // socket.on("createChatroom", async ({ userId, recipientId }) => {
  //   try {
  //     const chatroom = await chatController.createChatroom(roomId);
  //     socket.join(chatroom.name);
  //     socket.emit("chatroomCreated", chatroom);
  //   } catch (error) {
  //     socket.emit("createChatroomError", { message: error.message });
  //   }
  // });

  // // Handle disconnect event
  // socket.on("disconnect", () => {
  //   console.log("Client disconnected");
  // });
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
