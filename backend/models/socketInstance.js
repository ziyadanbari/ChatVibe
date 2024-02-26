import pkg from "mongoose";
const { Schema, model, models } = pkg;

const socketInstanceSchema = new Schema({
  socketId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "Users",
  },
});

const socketInstance =
  models.SocketInstance || model("SocketInstance", socketInstanceSchema);
export { socketInstance };
