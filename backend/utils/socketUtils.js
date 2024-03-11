import { socketInstance } from "../models/socketInstance.js";

export async function getUserBySocketId(socketId) {
  return await socketInstance.findOne({ socketId }).populate("user");
}

export async function getUserSocketId(userId) {
  const result = await socketInstance.findOne({ user: userId });
  return result ? result.socketId : null;
}
export async function emitToUser({
  socketId,
  userId,
  io,
  eventName,
  emitData,
}) {
  if (!socketId) {
    const instance = await socketInstance
      .findOne({ user: userId })
      .populate("user");
    if (!instance) return false;
    socketId = instance.socketId;
  }
  io.to(socketId).emit(eventName, { ...emitData });
}
