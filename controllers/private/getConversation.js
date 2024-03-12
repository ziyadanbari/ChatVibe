import { secureUserPopulate } from "../../constants/index.js";
import { Conversation } from "../../models/conversation.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { getUserSocketId } from "../../utils/socketUtils.js";

export async function getConversation(c) {
  try {
    const conversationId = c.req.param("id");
    const conversation = await Conversation.findById(conversationId).populate([
      {
        path: "members.user",
        select: `${secureUserPopulate} status lastActiveTime`,
      },
      {
        path: "messages.owner",
        select: `${secureUserPopulate} status lastActiveTime`,
      },
    ]);
    if (!conversation || conversation.aborted)
      throw [404, "Conversation not found"];
    const user = c.user;
    const isInConversationMembers = conversation.members.some(
      (member) => member.user._id.toString() === user._id.toString()
    );
    if (!isInConversationMembers) throw [401, "Not in conversation member"];

    conversation.messages.map(async (message) => {
      if (
        message.owner._id.toString() !== user._id.toString() &&
        !message.viewed
      ) {
        message.viewed = true;
      }
    });

    await conversation.save();
    conversation.members.forEach(async (member) => {
      if (member.user._id.toString() === user._id.toString()) return;
      const memberSocketId = await getUserSocketId(member.user);
      global?.io?.to(memberSocketId).emit("messages_viewed", {
        conversationId,
      });
    });
    return c.json({ ...conversation._doc });
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}
