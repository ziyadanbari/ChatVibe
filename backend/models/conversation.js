import pkg from "mongoose";
import crypto from "crypto";
const { Schema, model, models } = pkg;

export const Members = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});
const messageSchema = new Schema({
  messageId: {
    type: String,
    default: crypto.randomBytes(10).toString("hex"),
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  message: {
    messageType: {
      type: String,
      enum: ["text", "image", "video", "voice", "file"],
    },
    messageContent: {
      type: String,
    },
  },
  sendAt: {
    type: Date,
    default: Date.now,
  },
  viewed: {
    type: Boolean,
    default: false,
  },
  emitted: {
    type: Boolean,
    default: false,
  },
});

const conversationSchema = new Schema({
  members: [Members],
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  aborted: {
    type: Boolean,
    default: false,
  },
});

const Conversation =
  models.Conversations || model("Conversations", conversationSchema);

export { Conversation };
