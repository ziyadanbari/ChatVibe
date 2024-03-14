import { friendRequestAction } from "../controllers/private/socket/friendRequestAction.js";
import { addFriendRequest } from "../controllers/private/socket/addFriendRequest.js";
import { deleteMessage } from "../controllers/private/socket/deleteMessage.js";
import { friendAction } from "../controllers/private/socket/friendAction.js";
import { markMessagesAsRead } from "../controllers/private/socket/markMessagesAsRead.js";
import { sendMessage } from "../controllers/private/socket/sendMessage.js";
import { checkSocketAuthorization } from "../middlewares/checkAuthorzation.socket.js";
import { socketInstance } from "../models/socketInstance.js";
import { User } from "../models/user.js";
import { getUserBySocketId, getUserSocketId } from "../utils/socketUtils.js";

export async function handleSocket(io) {
  io.use(checkSocketAuthorization);
  io.on("connection", async (socket) => {
    const socketId = socket.id;
    const { user } = (await getUserBySocketId(socketId)) || {};
    if (!user) return;
    await User.updateOne({ _id: user._id }, { $set: { status: "online" } });
    const userFriends = user.friends.map((friend) => friend.user);
    const friendsSockets = await socketInstance.find({
      user: { $in: userFriends },
    });
    friendsSockets.map(async (socket) => {
      await io.to(socket.socketId).emit("refresh", { action: "refresh" });
    });
    socket.on("friend_request", async (data) =>
      addFriendRequest({ data, socket, io })
    );
    socket.on("friend_request_action", async (data) => {
      friendRequestAction({ data, socket, io });
    });
    socket.on("friend_action", async (data) => {
      friendAction({ data, socket, io });
    });
    socket.on("send_message", async (data) => {
      sendMessage({ data, socket, io });
    });
    socket.on("messages_viewed", async (data) => {
      markMessagesAsRead({ io, data, socket });
    });
    socket.on("delete_message", async (data) => {
      deleteMessage({ data, io, socket });
    });
    socket.on("disconnect", async () => {
      try {
        await socketInstance.findOneAndDelete({
          socketId: socket.id,
        });

        await User.updateOne(
          { _id: user._id },
          { $set: { status: "offline", lastActiveTime: Date.now() } }
        );
        const userFriends = user.friends.map((friend) => friend.user);
        const friendsSockets = await socketInstance.find({
          user: { $in: userFriends },
        });
        friendsSockets.map(async (socket) => {
          io.to(socket.socketId).emit("refresh", { action: "refresh" });
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
}
