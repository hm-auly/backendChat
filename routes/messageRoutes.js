// const express = require("express");
// const router = express.Router();
// const Message = require("../models/Message");
// const multer = require("multer");

// // File upload setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// // POST message (text/image/video/voice)
// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     const { sender, content, link } = req.body;
//     const file = req.file;

//     const newMessage = new Message({
//       sender,
//       content,
//       link,
//       image: file?.mimetype.startsWith("image") ? file.path : null,
//       video: file?.mimetype.startsWith("video") ? file.path : null,
//       voice: file?.mimetype.startsWith("audio") ? file.path : null,
//     });

//     const savedMessage = await newMessage.save();
//     res.status(201).json(savedMessage);
//   } catch (err) { res.status(500).json(err); }
// });

// // PUT message (edit)
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedMessage = await Message.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
//     res.status(200).json(updatedMessage);
//   } catch (err) { res.status(500).json(err); }
// });

// // DELETE message
// router.delete("/:id", async (req, res) => {
//   try {
//     await Message.findByIdAndDelete(req.params.id);
//     res.status(200).json("Message deleted");
//   } catch (err) { res.status(500).json(err); }
// });

// // GET all messages
// router.get("/", async (req, res) => {
//   try {
//     const messages = await Message.find().sort({ createdAt: 1 });
//     res.status(200).json(messages);
//   } catch (err) { res.status(500).json(err); }
// });

// module.exports = router;