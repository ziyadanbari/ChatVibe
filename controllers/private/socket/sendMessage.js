import { Conversation } from "../../../models/conversation.js";
import { CustomError } from "../../../utils/customError.js";
import { emitToUser, getUserBySocketId } from "../../../utils/socketUtils.js";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";

export async function sendMessage({ io, socket, data }) {
  try {
    let { conversationId, message, messageType } = data;
    if (!message) {
      throw new CustomError("Message required");
    } else if (Buffer.isBuffer(message) && !messageType) {
      const { mime } = (await fileTypeFromBuffer(message)) || {};
      messageType = mime ? mime.split("/")[0] : "text";
    }

    if (messageType === "text") {
      message = message.toString();
    } else {
      message = Array.isArray(message)
        ? message.map((m) => Buffer.from(m).toString("base64"))
        : Buffer.from(message).toString("base64");
    }

    const conversation = await Conversation.findById(conversationId)
      .populate("members.user")
      .exec();

    if (!conversation) {
      throw new CustomError("No conversation found");
    }

    const sender = (await getUserBySocketId(socket.id)).user;
    const receivers = conversation.members
      .filter((member) => member.user._id.toString() !== sender._id.toString())
      .map((member) => member.user);

    const createMessageData = (content, type) => {
      const randomMessageId = crypto.randomBytes(10).toString("hex");
      return {
        messageId: randomMessageId,
        owner: sender._id,
        message: {
          messageContent: content,
          messageType: type,
        },
        emitted: true,
        viewed: false,
      };
    };

    if (Array.isArray(message)) {
      message = message.map((m) => {
        const messageData = createMessageData(m, messageType);
        conversation.messages.push(messageData);
        return { m, messageId: messageData.messageId };
      });
      await conversation.save();
    } else {
      const messageData = createMessageData(message, messageType);
      var messageId = messageData.messageId;
      conversation.messages.push(messageData);
    }

    const emitData = {
      owner: {
        username: sender.username,
        profile_pic: sender.profile_pic,
        _id: sender._id,
      },
      conversationId,
      sendAt: Date.now(),
    };

    if (Array.isArray(message)) {
      receivers.forEach(async (receiver) => {
        await Promise.all(
          message.map((m) => {
            const data = {
              ...emitData,
              message: { messageContent: m.m, messageType },
              messageId: m.messageId,
            };
            emitToUser({
              userId: receiver._id,
              emitData: data,
              eventName: "new_message",
              io,
            });
            socket.emit("message_emitted", { ...data, status: "emitted" });
          })
        );
      });
    } else {
      receivers.forEach((receiver) => {
        const data = {
          ...emitData,
          message: { messageContent: message, messageType },
          messageId: messageId,
        };
        emitToUser({
          userId: receiver._id,
          emitData: data,
          eventName: "new_message",
          io,
        });
      });
      socket.emit("message_emitted", {
        ...emitData,
        message: { messageContent: message, messageType },
        messageId: randomMessageId,
        status: "emitted",
      });
    }
  } catch (error) {
    console.log(error);
    socket.emit("error", { error: error.error || "Internal server error" });
  }
}
