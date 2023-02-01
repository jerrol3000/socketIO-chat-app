const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "chat-app/public/")));

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "chat-app/public/index.html"));
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} is connected`);
  socket.on("new message", (message) => {
    io.emit("receive message", message);
  });
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} is disconnected`);
  });
});

server.listen(port, console.log(`Server listening on port ${port}`));
