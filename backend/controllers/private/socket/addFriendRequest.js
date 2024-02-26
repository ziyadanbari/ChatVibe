import mongoose from "mongoose";
import { User } from "../../../models/user.js";
import { socketInstance } from "../../../models/socketInstance.js";
import { CustomError } from "../../../utils/customError.js";

export async function addFriendRequest(data, socket) {
  try {
    const userSocketId = socket.id;
    const requestedUser = await socketInstance
      .findOne({ socketId: userSocketId })
      .populate("user");

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

    const isExistInWaitList = searchedUser.friendWaitList.some(
      (doc) => doc.user._id.toString() === requestedUser.user._id.toString()
    );

    if (isExistInWaitList) {
      searchedUser.friendWaitList = searchedUser.friendWaitList.filter(
        (doc) => doc.user._id.toString() !== requestedUser.user._id.toString()
      );
    } else {
      searchedUser.friendWaitList.push({ user: requestedUser.user._id });
    }

    await searchedUser.save();
    socket.emit("response", { test: "test" });
  } catch (error) {
    socket.emit("error", error.error || "Internal server error");
  }
}

async function findUser(identifier) {
  let query = {
    $or: [
      {
        username: identifier,
      },
      {
        email: identifier,
      },
      {
        _id: mongoose.Types.ObjectId.isValid(identifier)
          ? mongoose.Types.ObjectId(identifier)
          : null,
      },
    ],
  };
  return await User.findOne(query);
}
