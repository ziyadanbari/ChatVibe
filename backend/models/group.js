import { models, model, Schema } from "mongoose";
import crypto from "crypto";
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
