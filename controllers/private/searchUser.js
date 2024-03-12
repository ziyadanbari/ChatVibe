import { User } from "../../models/user.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";

export async function searchUser(c) {
  try {
    const userSearched = c.req.param("user");
    const user = c.user;
    const escapedUserSearched = userSearched.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regexPattern = [...escapedUserSearched]
      .map((char) => `(?=.*${char})`)
      .join("");
    const result = await User.find({
      username: { $regex: new RegExp(`^${regexPattern}`, "ig") },
    })
    const filteredResult = await filterResult(user, result);
    return c.json({ users: filteredResult });
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}

async function filterResult(user, result) {
  let filteredResult = result.filter(
    ({ _id }) => _id.toString() !== user._id.toString()
  );

  filteredResult = await Promise.all(
    filteredResult.map(async (searchedUser) => {
      let pass = false;
      try {
        const conversationId = await isInUserFriends({
          userId: user._id,
          friendId: searchedUser._id,
        });
        searchedUser = {
          username: searchedUser.username,
          profile_pic: searchedUser.profile_pic,
          status: "friend",
          conversationId,
        };
        pass = true;
      } catch (error) {}
      if (!pass) {
        try {
          await isInUserFriendWaitList({
            userId: user._id,
            friendId: searchedUser._id,
          });
          searchedUser = {
            username: searchedUser.username,
            profile_pic: searchedUser.profile_pic,
            status: "inWaitList",
          };
        } catch (error) {
          searchedUser = {
            username: searchedUser.username,
            profile_pic: searchedUser.profile_pic,
          };
        }
      }
      return searchedUser;
    })
  );
  return filteredResult;
}

async function isInUserFriends({ userId, friendId }) {
  return new Promise((resolve, reject) => {
    try {
      let isFriend = false;
      let conversationId;
      User.findById(userId).then((user) => {
        user?.friends?.forEach((friend) => {
          if (friend.user.toString() === friendId.toString()) {
            conversationId = friend.conversationId;
            isFriend = true;
          }
        });
        isFriend ? resolve(conversationId) : reject(isFriend);
      });
    } catch (error) {
      reject(false);
    }
  });
}

async function isInUserFriendWaitList({ userId, friendId }) {
  return new Promise((resolve, reject) => {
    try {
      let isInFriendWaitList = false;
      User.findById(userId).then((user) => {
        user?.friendWaitList?.forEach(({ user: friend }) => {
          friend._id.toString() === friendId.toString() &&
            (isInFriendWaitList = true);
        });

        isInFriendWaitList
          ? resolve(isInFriendWaitList)
          : reject(isInFriendWaitList);
      });
    } catch (error) {
      reject(false);
    }
  });
}
