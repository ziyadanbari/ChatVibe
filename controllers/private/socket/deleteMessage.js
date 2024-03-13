import { Conversation } from "../../../models/conversation.js";
import { CustomError } from "../../../utils/customError.js";
import { emitToUser, getUserBySocketId } from "../../../utils/socketUtils.js";

export async function deleteMessage({ data, socket, io }) {
  try {
    const { user } = (await getUserBySocketId(socket?.id)) || {};
    const { conversationId, messageId } = data || {};
    if (!conversationId || !messageId) throw new CustomError("Fields required");
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new CustomError("Conversation not found");
    conversation.messages = conversation?.messages
      ?.map((message) => {
        if (message.owner.toString() === user._id.toString()) {
          if (messageId !== message.messageId) return message;
        } else return message;
      })
      .filter((ele) => ele);
    await conversation.save();
    await Promise.resolve(
      conversation.members.forEach(async (member) => {
        await emitToUser({
          userId: member.user,
          emitData: { conversationId, messageId },
          eventName: "delete_message",
          io,
        });
      })
    );
  } catch (error) {
    return socket.emit("error", {
      error: error?.error || "Internal server error",
    });
  }
}
