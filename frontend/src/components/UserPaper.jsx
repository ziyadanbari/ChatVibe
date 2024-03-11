import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage } from "./ui/avatar.jsx";
import { toasty } from "@/lib/toasty.js";
import useSocket from "@/hooks/useSocket.js";
import AddFriendButton from "./AddFriendButton.jsx";
import { useState } from "react";
import Loading from "./ui/Loading.jsx";
import {
  AcceptFriendRequest,
  RejectFriendRequest,
} from "./FriendRequestActions.jsx";
import { Badge } from "@/components/ui/badge";
import { formatDateDistance } from "@/lib/formatDate.js";
import UserProfilePic from "./UserProfilePic.jsx";

export default function UserPaper({
  profile_pic,
  username,
  _id,
  status,
  requestId,
  isOnline,
  lastActiveTime,
  lastMessage,
  CustomAction,
}) {
  const { socket } = useSocket();
  const [isFriendRequestLoading, setIsFriendRequestLoading] = useState(false);
  const postFriendRequest = async () => {
    try {
      setIsFriendRequestLoading(true);
      socket.emit("friend_request", {
        user: _id || username,
      });
    } catch (error) {
      toasty("error", error);
    } finally {
      setIsFriendRequestLoading(false);
    }
  };
  return (
    <div className="p-2 rounded-sm hover:bg-main-dark-gray cursor-pointer flex justify-between items-center gap-1">
      <div className="flex items-center gap-2 flex-1">
        <UserProfilePic profile_pic={profile_pic} isOnline={isOnline} />
        <div className="flex gap-1 flex-1 flex-col">
          <div className="flex items-center justify-between flex-1">
            <div className="flex-1 w-32 whitespace-nowrap overflow-hidden text-ellipsis font-semibold text-lg">
              {username || <Skeleton className={"w-full h-2 rounded-full"} />}
            </div>
            {isOnline === false && (
              <div className=" text-main-gray text-sm">
                {formatDateDistance(lastActiveTime)}
              </div>
            )}
          </div>
          {lastMessage && (
            <div className="text-sm text-main-gray">
              {lastMessage.message.messageContent}
            </div>
          )}
        </div>
      </div>
      <div>
        {CustomAction ||
          (username && (
            <div className="mx-4">
              {isFriendRequestLoading ? (
                <Loading className={"!w-5 !h-5 !border-2"} />
              ) : status === "friend" ? null : status === "inWaitList" ? (
                <div className="flex items-center gap-1">
                  <AcceptFriendRequest requestId={requestId} />
                  <RejectFriendRequest requestId={requestId} />
                </div>
              ) : (
                <div onClick={postFriendRequest}>
                  <AddFriendButton />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
