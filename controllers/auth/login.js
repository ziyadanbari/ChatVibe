import { serialize } from "cookie";
import { errorResponse } from "../../constants/index.js";
import { User } from "../../models/user.js";
import { loginSchema } from "../../schemas/index.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { assignNewAccessToken } from "../../utils/assignAccessToken.js";

export async function login(c) {
  try {
    const body = await c.req.json();
    const { username, password } = body || {};
    const isFormValid = loginSchema.safeParse({ username, password });
    if (!isFormValid.success) throw [400, isFormValid.error.errors[0].message];
    const user = await User.findOne({ username });
    if (!user) throw errorResponse.WrongCreds;
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) throw errorResponse.WrongCreds;
    const { token, expirationDate } = await assignNewAccessToken({
      userId: user._id.toString(),
    });

    return c.json({ message: `Welcome ${username}` }, 200, {
      "Set-Cookie": serialize("token", token, {
        maxAge: expirationDate,
        path: "/",
        httpOnly: false,
        sameSite: "none",
      }),
    });
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}
