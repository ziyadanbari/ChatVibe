import { User } from "../../../models/user.js";
import { CustomError } from "../../../utils/customError.js";
import { emitToUser, getUserBySocketId } from "../../../utils/socketUtils.js";
import { findUser } from "./addFriendRequest.js";

export async function friendAction({ data, socket, io }) {
  try {
    const socketId = socket.id;
    const srcUser = await getUserBySocketId(socketId);
    const actions = {
      remove: removeFriend,
    };
    const { action, user } = data;
    if (!action) throw new CustomError("Bad request");
    if (action === "remove_friend") {
      if (!user) throw new CustomError("User required");
      const removedUser = await actions.remove(srcUser.user, user);
      await emitToUser({
        userId: removedUser._id,
        io,
        eventName: "refresh",
        emitData: { action: "refresh" },
      });
      socket.emit("refresh", { action: "refresh" });
    }
  } catch (error) {
    console.log(error);
    return socket.emit("error", {
      error: error.error || "Internal server error",
    });
  }
}

async function removeFriend(user, removedUser) {
  removedUser = await findUser(removedUser);
  await User.removeFriend(user._id, removedUser._id);
  return removedUser;
}
