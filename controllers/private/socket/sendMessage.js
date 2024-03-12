import { Conversation } from "../../../models/conversation.js";
import { CustomError } from "../../../utils/customError.js";
import { emitToUser, getUserBySocketId } from "../../../utils/socketUtils.js";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";

export async function sendMessage({ io, socket, data }) {
  try {
    let { conversationId, message, messageType } = data;
    if (!message) throw new CustomError("Message required");
    else if (Buffer.isBuffer(message) && !messageType) {
      const { mime } = (await fileTypeFromBuffer(message)) || {};
      if (!mime) return (messageType = "text");
      type = messageType = mime.split("/")[0];
    }
    if (messageType === "text") message = message.toString();
    else if (messageType !== "text") {
      message = Buffer.from(message).toString("base64");
    }
    // Find the conversation
    const conversation = await Conversation.findById(conversationId)
      .populate("members.user")
      .exec();

    // Throw error if conversation not found
    if (!conversation) {
      throw new CustomError("No conversation found");
    }

    // Get the sender's user data
    const sender = (await getUserBySocketId(socket.id)).user;

    // Get receivers excluding the sender
    const receivers = conversation.members
      .filter((member) => member.user._id.toString() !== sender._id.toString())
      .map((member) => member.user);

    // Generate a random message ID
    const randomMessageId = crypto.randomBytes(10).toString("hex");

    // Create message data
    const messageData = {
      messageId: randomMessageId,
      owner: sender._id,
      message: {
        messageContent: message,
        messageType,
      },
      emitted: true,
      viewed: false,
    };

    // Push message to conversation and save
    conversation.messages.push(messageData);
    await conversation.save();

    // Emit new message event to each receiver
    for (const receiver of receivers) {
      await emitToUser({
        userId: receiver._id,
        emitData: {
          ...messageData,
          owner: {
            username: sender.username,
            profile_pic: sender.profile_pic,
            _id: sender._id,
          },
          conversationId,
          sendAt: Date.now(),
        },
        eventName: "new_message",
        io,
      });
    }

    // Emit message emitted event to sender
    socket.emit("message_emitted", {
      ...messageData,
      owner: {
        username: sender.username,
        profile_pic: sender.profile_pic,
        _id: sender._id,
      },
      conversationId,
      sendAt: Date.now(),
      status: "emitted",
    });
  } catch (error) {
    console.log(error);
    socket.emit("error", {
      error: error.error || "Internal server error",
    });
  }
}
