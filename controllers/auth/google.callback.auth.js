import { OAuth2Client } from "google-auth-library";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { userInfoGoogleApi } from "../../constants/index.js";
import { assignNewUser } from "../../utils/assignNewUser.js";
import { assignNewAccessToken } from "../../utils/assignAccessToken.js";
import { User } from "../../models/user.js";
import { serialize } from "cookie";
import { cookieSettings } from "../../constants/index.js";
export async function googleCallbackHandler(c) {
  try {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );
    const body = await c.req.json();
    const { code } = body;
    if (!code) throw [400, "Authorization Code missed"];
    const r = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(r.tokens);
    const userData = (await oAuth2Client.request({ url: userInfoGoogleApi }))
      .data;
    if (!userData) throw new Error("Something went wrong");
    const { email, name: username, picture: profile_pic } = userData;
    const user = await User.findOne({ email });
    if (!user) {
      const newUser = await assignNewUser({
        username,
        email,
        profile_pic,
        provider: "google",
      });
      if (!newUser) throw new Error("Something went wrong");
      const { token, expirationDate } = await assignNewAccessToken({
        userId: newUser._id.toString(),
      });
      return c.json({ message: `Welcome ${newUser.username}` }, 200, {
        "Set-Cookie": serialize("token", token, {
          maxAge: expirationDate,
          path: "/",
          httpOnly: false,
        }),
      });
    }
    const { token, expirationDate } = await assignNewAccessToken({
      userId: user._id.toString(),
    });

    return c.json({ message: `Welcome ${user.username}` }, 200, {
      "Set-Cookie": serialize("token", token, {
        maxAge: expirationDate,
        ...cookieSettings,
      }),
    });
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}
