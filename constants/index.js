export const userInfoGoogleApi =
  "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
export const secureUserPopulate = "username profile_pic";

export const errorResponse = {
  Unauthorized: [401, "Unauthorized"],
  Used: [409, "Cannot use this username"],
  WrongCreds: [401, "Username or password incorrect"],
};

export const cookieSettings = {
  path: "/",
  httpOnly: false,
  sameSite: "lax",
  secure: false,
};
