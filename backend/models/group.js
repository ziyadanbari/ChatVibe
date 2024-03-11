import pkg from "mongoose";
import crypto from "crypto";
import { Members } from "./conversation.js";
const { Schema, model, models } = pkg;

const groupSchema = new Schema({
  members: [Members],
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversations",
  },
  roomId: {
    type: String,
    default: crypto.randomBytes(10).toString("hex"),
  },
});

const Group = models.Groups || model("Groups", groupSchema);
export { Group };
