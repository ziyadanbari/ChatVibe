import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar.jsx";
import { Badge } from "../ui/badge.jsx";
import { formatDateDistance } from "@/lib/formatDate.js";
import { MoreVertical, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSocket from "@/hooks/useSocket.js";
import UserProfilePic from "../UserProfilePic.jsx";

export function MoreOptions({ username, _id }) {
  const { socket } = useSocket();
  async function removeFriend() {
    socket.emit("friend_action", {
      user: _id || username,
      action: "remove_friend",
    });
  }
  const options = [
    {
      label: "Remove friend",
      Icon: UserMinus,
      className: "text-red-500",
      onClick: removeFriend,
    },
  ];
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="hover:bg-main-dark-gray p-1 rounded-full cursor-pointer">
            <MoreVertical />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {options.map((option, i) => {
            const { label, Icon, onClick, ...args } = option;
            return (
              <DropdownMenuItem key={i} onClick={onClick} {...args}>
                <div className="flex items-center">
                  <div>
                    <Icon size={22} />
                  </div>
                  <DropdownMenuLabel className="text-sm">
                    {label}
                  </DropdownMenuLabel>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function UserProfileHeader({
  profile_pic,
  username,
  isOnline,
  lastActiveTime,
  _id,
}) {
  return (
    <div className="md:px-10 px-2 py-2 bg-main-black">
      <div className="w-full flex justify-between items-center">
        <div className="flex-1 flex gap-3 items-center">
          <div>
            <UserProfilePic profile_pic={profile_pic} isOnline={isOnline} />
          </div>
          <div className="flex-1">
            <div className="text-lg font-normal">{username}</div>
            <div className=" text-xs">
              {isOnline ? (
                <div className="text-main-blue">Online</div>
              ) : (
                <div className="text-main-gray">
                  {formatDateDistance(lastActiveTime)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <MoreOptions username={username} _id={_id} />
        </div>
      </div>
    </div>
  );
}
