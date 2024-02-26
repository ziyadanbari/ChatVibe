import { errorResponse } from "../../constants/index.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { parse } from "cookie";
export async function logout(c) {
  try {
    const cookies = parse(c.req.header("Cookie"));
    const token = cookies.token;
    if (!token) throw errorResponse.Unauthorized;
    const { user } = c || {};
    if (!user) throw errorResponse.Unauthorized;
    user.blackListTokens.push({ token });
    await user.save();
    return c.json({ status: "ok", message: "Logged out" }, 200);
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}
