const express = require('express');
const connectDB = require("./config/db");
const userRoutes = require('./routes/user_info');
const dotenv = require("dotenv");
const cors = require('cors');
const Chat = require('./models/Chats')
dotenv.config();
connectDB();
// Express app
const app = express();
app.use(cors());

app.use(express.json({ limit: '10mb' }));

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  
  next();
});
const PORT = process.env.PORT;
const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);
// const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: "https://classopediaa.netlify.app",
   }
});
io.on('connection', (socket) => {
  console.log("io function running")
  socket.on("chat", (payload) => {
    console.log(payload);
    io.to(payload.room).emit("chat", payload);
    const chatMessage = new Chat({
      message: payload.message,
      username: payload.username,
      room: payload.room,
      userid: payload.userid,
      timestamp: payload.timestamp,
    });
    chatMessage.save()
      .then(() => {
        console.log('Chat message saved to the database.');
      })
      .catch((error) => {
        console.error('Error saving chat message to the database:', error);
      });
  });
  
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });
 // Inside io.on('connection', (socket) => {...})

// Handling typing status from the frontend
socket.on("typing", (payload) => {
  const { username, room, isTyping } = payload;
  if (isTyping) {
    io.to(room).emit("typing", { username });
  } else {
    io.to(room).emit("stop typing", { username });
  }
});

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });
});

app.use('/', userRoutes);

