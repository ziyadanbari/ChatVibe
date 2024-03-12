import { OAuth2Client } from "google-auth-library";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";

export async function googleAuth(c) {
  try {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );
    const googleAuthUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
    return c.redirect(googleAuthUrl);
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}
