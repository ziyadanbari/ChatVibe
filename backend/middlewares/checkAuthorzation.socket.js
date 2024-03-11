import { parse } from "cookie";
import { errorResponse } from "../constants/index.js";
import { socketInstance } from "../models/socketInstance.js";
import { verify } from "hono/jwt";
import { User } from "../models/user.js";
export async function checkSocketAuthorization(socket, next) {
  try {
    const headers = socket?.handshake?.headers;
    const token = parse(headers.auth || "")?.token;
    if (!token) return next(new Error(errorResponse.Unauthorized[1]));
    const { userId } = (await verify(token, process.env.JWT_SECRET)) || {};
    const user = await User.findById(userId);
    if (!user) return next(new Error(errorResponse.Unauthorized[1]));
    const userSocketInstance = await socketInstance.findOne({ user: userId });
    if (userSocketInstance) {
      userSocketInstance.socketId = socket.id;
      await userSocketInstance.save();
      return next();
    }
    const newSocketInstance = new socketInstance({
      socketId: socket.id,
      user: user._id,
    });
    await newSocketInstance.save();
    return next();
  } catch (error) {
    console.log(error);
    return next(new Error("Internal server error"));
  }
}
