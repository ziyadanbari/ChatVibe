import { parse } from "cookie";
import { errorResponse } from "../constants/index.js";
import { User } from "../models/user.js";
import { apiErrorHandler } from "../utils/apiErrorHandler.js";
import { verify } from "hono/jwt";

export async function checkAuthorization(c, next) {
  try {
    const cookies = parse(c.req.header("Cookie") || "");
    const token = cookies?.token;
    if (!token) throw errorResponse.Unauthorized;
    const { userId } = await verify(token, process.env.JWT_SECRET);
    if (!userId) throw errorResponse.Unauthorized;
    const user = await User.findById(userId).populate([
      { path: "friendWaitList.user", select: "username profile_pic" },
      {
        path: "friends.user",
        select: "username profile_pic status lastActiveTime",
      },
    ]);
    if (!user || user?.isTokenBlackList(token))
      throw errorResponse.Unauthorized;
    c.user = user;
    return next();
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}
