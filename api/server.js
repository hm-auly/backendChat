// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(`mongodb+srv://Auly:auly12345@auly.m4ukbxq.mongodb.net/?retryWrites=true&w=majority&appName=Auly`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err + "mongo"));

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  image: String,
  video: String,
  voice: String,
  link: String,
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// Upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST message (text/file/voice)
app.post("/api/messages", upload.single("file"), async (req, res) => {
  let newMessage = { sender: req.body.sender, content: req.body.content || "" };

  // Handle image/video/voice
  if (req.file) {
    if (req.file.mimetype.startsWith("image")) newMessage.image = `/uploads/${req.file.filename}`;
    else if (req.file.mimetype.startsWith("video")) newMessage.video = `/uploads/${req.file.filename}`;
    else if (req.file.mimetype.startsWith("audio")) newMessage.voice = `/uploads/${req.file.filename}`;
  }

  const message = new Message(newMessage);
  await message.save();

  // Real-time broadcast
  io.emit("receiveMessage", message);
  res.json(message);
});

// GET all messages (oldest to newest)
app.get("/api/messages", async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 });
  res.json(messages);
});

// DELETE message
app.delete("/api/messages/:id", async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// UPDATE message
app.put("/api/messages/:id", async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, { content: req.body.content }, { new: true });
  res.json(message);
});

// s

// // server.js এর নিচে যোগ করো
// app.delete("/api/messages/:id", async (req, res) => {
//   try {
//     await Message.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.put("/api/messages/:id", async (req, res) => {
//   try {
//     const msg = await Message.findByIdAndUpdate(
//       req.params.id,
//       { content: req.body.content },
//       { new: true }
//     );
//     res.json(msg);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// s

// Socket.io connection
io.on("connection", socket => {
  console.log("User connected");

  socket.on("sendMessage", msg => {
    io.emit("receiveMessage", msg); // Broadcast
  });
});

// server.listen(5000, () => console.log("Server running on 5000"));
module.exports = app;