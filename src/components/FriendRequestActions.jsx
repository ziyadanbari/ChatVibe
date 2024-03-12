import useSocket from "@/hooks/useSocket.js";
import { Button } from "./ui/button.jsx";
import { UserRoundCheck, X } from "lucide-react";
import useSession from "@/hooks/useSession.js";

export function AcceptFriendRequest({ requestId }) {
  const { socket } = useSocket();
  const { refreshSession } = useSession();
  const acceptFriendRequest = async () => {
    socket.emit("friend_request_action", { requestId, action: "accept" });
    refreshSession();
  };
  return (
    <div>
      <Button
        onClick={acceptFriendRequest}
        size="icon"
        className="bg-transparent hover:bg-main-gray/30 text-white">
        <UserRoundCheck />
      </Button>
    </div>
  );
}

export function RejectFriendRequest({ requestId }) {
  const { socket } = useSocket();
  const rejectFriendRequest = async () => {
    console.log(socket);
    socket.emit("friend_request_action", { requestId, action: "reject" });
  };
  return (
    <div>
      <Button
        onClick={rejectFriendRequest}
        size="icon"
        className="bg-transparent hover:bg-main-gray/30 text-white text-red-500">
        <X />
      </Button>
    </div>
  );
}
