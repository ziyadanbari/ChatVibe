import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { parse } from "cookie";
import { verify } from "hono/jwt";
import { User } from "../../models/user.js";
import { errorResponse } from "../../constants/index.js";
export default async function getUserProfile(c) {
  try {
    let user = c.user;
    if (user) {
      const cookies = parse(c.req.header("Cookie"));
      const token = cookies?.token;
      if (!token) throw errorResponse.Unauthorized;
      const { userId } = await verify(token, process.env.JWT_SECRET);
      if (!userId) throw errorResponse.Unauthorized;
      user = await User.findById(userId);
      if (!user) throw errorResponse.Unauthorized;
    }
    return c.json({
      ...user._doc,
      password: undefined,
      _id: undefined,
      __v: undefined,
      blackListTokens: undefined,
    });
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}
