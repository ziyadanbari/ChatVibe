import pkg from "mongoose";
import bcrypt from "bcrypt";
const { Schema, model, models } = pkg;
const Friends = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  invitedAt: {
    type: Date,
    default: Date.now,
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversations",
  },
});

const FriendWaitList = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
    default: "",
  },
  password: {
    type: String,
    required: false,
    default: null,
  },
  profile_pic: {
    type: String,
    required: false,
    default:
      "https://qfls3jg2rvliofdo.public.blob.vercel-storage.com/a5e1e069354f874c0e8d03e363a06fd02ffdf001-itYINcjP0vV60686R373X94dDLcujc.png",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  provider: {
    type: String,
    default: "email",
    enum: ["email", "google", "facebook"],
  },
  status: {
    type: String,
    default: "offline",
    enum: ["online", "offline"],
  },
  lastActiveTime: {
    type: Date,
    default: Date.now,
  },
  friends: [Friends],
  groups: [
    {
      roomId: {
        type: Schema.Types.ObjectId,
        ref: "Groups",
      },
    },
  ],
  friendWaitList: [FriendWaitList],
  blackListTokens: [
    {
      token: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $exists: true } } }
);

userSchema.methods.matchPassword = async function (password) {
  const userPassword = this.password;
  if (!userPassword) return false;
  const isMatched = await bcrypt.compare(password, userPassword);
  return isMatched;
};
userSchema.methods.isTokenBlackList = function (token) {
  return this.blackListTokens.some((item) => item.token === token);
};

userSchema.statics.updateFriendLists = async function (
  user1Id,
  user2Id,
  conversationId
) {
  try {
    await this.updateOne(
      { _id: user1Id },
      { $addToSet: { friends: { user: user2Id, conversationId } } }
    );
    await this.updateOne(
      { _id: user2Id },
      { $addToSet: { friends: { user: user1Id, conversationId } } }
    );
    await this.updateOne(
      { _id: user1Id },
      { $pull: { friendWaitList: { user: user2Id } } }
    );
    await this.updateOne(
      { _id: user2Id },
      { $pull: { friendWaitList: { user: user1Id } } }
    );
    await models?.Conversations?.updateOne(
      { $and: [{ "members.user": user1Id }, { "members.user": user2Id }] },
      { $set: { aborted: false } }
    );
  } catch (error) {
    console.error("Error updating friend lists:", error);
    throw error;
  }
};
userSchema.statics.removeFriend = async function (user1Id, user2Id) {
  try {
    const conversation = await models?.Conversations?.updateOne(
      { $and: [{ "members.user": user1Id }, { "members.user": user2Id }] },
      { $set: { aborted: true } },
      { new: true }
    );
    await this.updateOne(
      { _id: user1Id },
      { $pull: { friends: { user: user2Id } } }
    );
    await this.updateOne(
      { _id: user2Id },
      { $pull: { friends: { user: user1Id } } }
    );
  } catch (error) {
    console.error("Error updating friend lists:", error);
    throw error;
  }
};

userSchema.pre("save", function (next, { hashPassword }) {
  if (hashPassword) this.password = bcrypt.hashSync(this.password, 10);
  this.profile_pic =
    this.profile_pic ||
    "https://qfls3jg2rvliofdo.public.blob.vercel-storage.com/a5e1e069354f874c0e8d03e363a06fd02ffdf001-itYINcjP0vV60686R373X94dDLcujc.png";
  return next();
});

const User = models.Users || model("Users", userSchema);
export { User };
