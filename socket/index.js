import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import getUserDetailsFromToken from "../helper/getUserDetailsFromToken.js";
import User from "../models/user.Model.js";
import Conversation from "../models/conversation.Model.js";
import Message from "../models/message.Model.js";
// import getConversation from "../helper/getConversation.js";

const app = express();
dotenv.config({ path: ".env" });

// Socket connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const onlineUser = new Set();
io.on("connection", async (socket) => {
  console.log("connected user", socket.id);

  const token = socket.handshake.auth.token;

  //current user details
  const user = await getUserDetailsFromToken(token);

  //create a room
  socket.join(user?._id.toString());
  onlineUser.add(user?._id.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    const userDetails = await User.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser?.has(userId),
    };
    socket.emit("message-user", payload);

    //get previous message
    const getConversationMessage = await Conversation.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });
    socket.emit("message", getConversationMessage?.messages);
  });

  //new message
  socket.on("new message", async (data) => {
    //check conversation is available or not for both user
    let conversation = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });
    //if converstaion is not available
    if (!conversation) {
      const createConversation = await Conversation({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }
    console.log("converstaion", conversation);
    const message = new Message({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data?.msgByUserId,
    });
    const saveMessages = await message.save();

    const updateConversation = await Conversation.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: saveMessages?._id },
      }
    );
    const getConversationMessage = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage?.messages || []
    );
  });

  // Disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id);
    console.log("disconnected user", socket.id);
  });
});

export { app, server };
