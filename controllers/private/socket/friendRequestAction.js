import { Types } from "mongoose";
import { User } from "../../../models/user.js";
import { CustomError } from "../../../utils/customError.js";
import {
  emitToUser,
  getUserBySocketId,
  getUserSocketId,
} from "../../../utils/socketUtils.js";
import { Conversation } from "../../../models/conversation.js";

async function acceptRequest(request, user) {
  if (!request._id) throw new CustomError("Something went wrong");
  const actionedUser = request;
  // Check if conversation with the same members already exists
  const existingConversation = await Conversation.findOne({
    members: {
      $size: 2,
      $all: [
        { $elemMatch: { user: actionedUser._id } },
        { $elemMatch: { user: user._id } },
      ],
    },
  });
  if (existingConversation) {
    await User.updateFriendLists(
      user._id,
      actionedUser._id,
      existingConversation._id
    );
  } else {
    const newConversation = new Conversation({
      members: [
        {
          user: actionedUser._id,
        },
        {
          user: user._id,
        },
      ],
    });
    await newConversation.save();
    await User.updateFriendLists(
      user._id,
      actionedUser._id,
      newConversation._id
    );
  }
  user.friendWaitList = user.friendWaitList.filter(
    (list) => list.user.toString() === request._id.toString()
  );
  await user.save();
}
async function rejectRequest(request, user) {
  console.log(request.save);
  await request.deleteOne({
    user: user._id,
  });
}

export async function friendRequestAction({ data, socket, io }) {
  try {
    const actions = {
      accept: acceptRequest,
      reject: rejectRequest,
    };
    const user = (await getUserBySocketId(socket.id)).user;
    const { requestId, action } = data || {};
    if (!requestId) new CustomError("request id required");
    const request = await User.findOne({
      "friendWaitList._id": new Types.ObjectId(requestId),
    }).populate("friendWaitList.user");
    const actionedUser = request.friendWaitList.find(
      (req) => req._id.toString() === requestId
    ).user;
    switch (action) {
      case "accept":
        actions.accept(actionedUser, user);
        break;
      case "reject":
        actions.reject(request, user);
        break;
      default:
        throw new CustomError("Unknown action");
    }
    const actionedUserSocket = await getUserSocketId(actionedUser._id);
    if (actionedUserSocket) {
      // io.to(actionedUserSocket.socketId).emit("refresh", { action: "refresh" });
      await emitToUser({
        socketId: actionedUserSocket,
        io,
        eventName: "refresh",
        emitData: { action: "refresh" },
      });
    }
    socket.emit("refresh", { action: "refresh" });
  } catch (error) {
    console.log(error);
    socket.emit("error", error.error || "Internal server error");
  }
}
