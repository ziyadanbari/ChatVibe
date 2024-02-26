import { Schema, model, models } from "mongoose";
import { Members } from "./group";

const messageSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new Schema({
  members: [Members],
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Conversation =
  models.Conversations || model("Conversations", conversationSchema);

export { Conversation };
