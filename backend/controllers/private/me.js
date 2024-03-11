import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { parse } from "cookie";
import { verify } from "hono/jwt";
import { User } from "../../models/user.js";
import { errorResponse } from "../../constants/index.js";
import { Conversation } from "../../models/conversation.js";

export default async function getUserProfile(c) {
  try {
    let user = c.user;
    if (!user) {
      const cookies = parse(c.req.header("Cookie"));
      const token = cookies?.token;
      if (!token) throw errorResponse.Unauthorized;
      const { userId } = await verify(token, process.env.JWT_SECRET);
      if (!userId) throw errorResponse.Unauthorized;
      user = await User.findById(userId);
      if (!user) throw errorResponse.Unauthorized;
    }
    let friends = [];
    for (let i = 0; i < user.friends.length; i++) {
      const friend = user.friends[i];
      const conversation = await Conversation.findById(friend?.conversationId);
      const lastMessage = conversation.messages?.slice(-1)[0];
      friends.push({ ...friend._doc, lastMessage });
    }
    user = { ...user._doc, friends };
    return c.json({
      ...user,
      password: undefined,
      __v: undefined,
      blackListTokens: undefined,
      status: undefined,
    });
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}
