import { User } from "../models/user.js";

export async function assignNewUser({
  username,
  email,
  provider,
  password,
  profile_pic,
}) {
  const newUser = new User({
    username,
    email,
    provider,
    password,
    profile_pic,
  });
  await newUser.save();
  return newUser || false;
}
