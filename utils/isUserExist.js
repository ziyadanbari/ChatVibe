import { User } from "../models/user.js";

export async function isUserExist({ username, email = "" }) {
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  return user || false;
}
