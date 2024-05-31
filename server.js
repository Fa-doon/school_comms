const express = require("express");
require("dotenv").config();
const { connectToDB } = require("./config/db");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");

// Importing routes
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const roleRoute = require("./routes/roleRoute");

const { Chatroom, Chatmessage, User } = require("./models");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://school-comms.onrender.com", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/role", roleRoute);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connection to DB
connectToDB();

// Socket connection
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("joinroom", (roomName) => {
    socket.join(roomName);
    console.log(`Client joined: ${roomName}`);
  });

  socket.on("sendMessage", async (data) => {
    const { roomName, senderId, receiverId, message } = data;

    console.log(data);

    try {
      const chatMessage = await Chatmessage.create({
        room_id: roomName,
        sender_id: senderId,
        receiver_id: receiverId,
        message: message,
        seen: false,
      });

      // getting the sender's details to send with the emitted event
      const sender = await User.findByPk(senderId, {
        attributes: ["id", "name"],
      });

      io.to(roomName).emit("newMessage", {
        ...chatMessage.dataValues,
        sender: sender
          ? sender.get({ plain: true })
          : { id: senderId, name: "Unknown" },
      });

      // console.log(chatMessage);
    } catch (error) {
      console.log(`Error sending message`);
    }
  });

  socket.on("markMessagesAsSeen", async (data) => {
    const { roomName, userId } = data;

    try {
      await Chatmessage.update(
        { seen: true },
        {
          where: {
            room_id: roomName,
            sender_id: userId,
            seen: false,
          },
        }
      );

      io.to(roomName).emit("messagesSeen", { roomName, userId });
    } catch (error) {
      console.log("Error marking messages as seen", error);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    data: null,
    error: "Server Error",
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
