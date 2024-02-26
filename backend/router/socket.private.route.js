import { addFriendRequest } from "../controllers/private/socket/addFriendRequest.js";
import { checkSocketAuthorization } from "../middlewares/checkAuthorzation.socket.js";

export async function handleSocket(io) {
  io.use(checkSocketAuthorization);
  io.on("connection", (socket) => {
    socket.on("friend_request", async (data) => addFriendRequest(data, socket));
  });
}
