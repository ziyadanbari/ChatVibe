import { Conversation } from "../../../models/conversation.js";
import {
  getUserBySocketId,
  getUserSocketId,
} from "../../../utils/socketUtils.js";
export async function markMessagesAsRead({ io, data, socket }) {
  const { user } = await getUserBySocketId(socket.id);
  const conversation = await Conversation.findByIdAndUpdate(
    data.conversationId,
    {
      $set: { "messages.$[].viewed": true },
    },
    { new: true }
  );

  conversation.members.forEach(async (member) => {
    if (member.user === user._id) return;
    const memberSocketId = await getUserSocketId(member.user);
    io.to(memberSocketId).emit("messages_viewed", {
      conversationId: data.conversationId,
    });
  });
}
