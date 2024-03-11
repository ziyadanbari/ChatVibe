import mongoose from "mongoose";
import { User } from "../../../models/user.js";
import { CustomError } from "../../../utils/customError.js";
import {
  getUserBySocketId,
  getUserSocketId,
} from "../../../utils/socketUtils.js";

export async function addFriendRequest({ data, socket, io }) {
  try {
    const userSocketId = socket.id;
    const requestedUser = await getUserBySocketId(userSocketId);

    const user = data.user;
    if (!user) {
      throw new CustomError("User missing");
    }

    const searchedUser = await findUser(user);
    if (!searchedUser) {
      throw new CustomError("User not found");
    }

    if (searchedUser._id.toString() === requestedUser.user._id.toString()) {
      throw new CustomError("You cannot add yourself");
    }

    const searchedUserSocketId = await getUserSocketId(searchedUser._id);
    const isExistInWaitList = searchedUser.friendWaitList.some(
      (doc) => doc.user._id.toString() === requestedUser.user._id.toString()
    );
    if (isExistInWaitList) throw CustomError("Request to user already sended");
    searchedUser.friendWaitList?.push({
      user: requestedUser.user._id,
    });
    await searchedUser.save();
    io.to(searchedUserSocketId || "").emit("refresh", { action: "refresh" });
  } catch (error) {
    console.log(error);
    socket.emit("error", error.error || "Internal server error");
  }
}

export async function findUser(identifier) {
  let query = {
    $or: [
      { username: identifier },
      { email: identifier },
      {
        _id: mongoose.Types.ObjectId.isValid(identifier)
          ? new mongoose.Types.ObjectId(identifier)
          : null,
      },
    ],
  };
  return await User.findOne(query);
}
