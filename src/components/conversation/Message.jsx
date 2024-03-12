import React from "react";
import UserProfilePic from "../UserProfilePic.jsx";
import { formatTimeToAMPM } from "@/lib/convertTimeToAMPM.js";
import AudioPlayer from "./AudioPlayer.jsx";

export default function Message({
  owner,
  messageContent,
  messageType,
  sendAt,
  viewed,
  emitted,
  isSender,
  isTheLastMessage,
}) {
  const { profile_pic, username } = owner;
  return (
    <div
      className={`w-full ${isSender ? "self-end" : "self-start"}`}
      dir={isSender ? "rtl" : "ltr"}>
      <div className="flex items-start gap-3">
        <div>
          <UserProfilePic className={"h-10 w-10"} profile_pic={profile_pic} />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-5">
            <div className="text-base">{username}</div>
            <div className="text-[11px] text-main-gray" dir="ltr">
              {formatTimeToAMPM(
                new Date(sendAt).getHours(),
                new Date(sendAt).getMinutes()
              )}
            </div>
          </div>
          <div>
            <div className=" inline-block">
              <div
                className={` px-4 py-2 max-w-96 rounded-lg break-words ${
                  isSender
                    ? "bg-main-blue rounded-tr-none"
                    : "bg-main-dark-gray rounded-tl-none"
                }`}
                dir={isSender ? "ltr" : ""}>
                {messageType === "text" ? (
                  messageContent
                ) : messageType === "audio" ? (
                  <AudioPlayer media={messageContent} />
                ) : null}
              </div>
              {isTheLastMessage && isSender && viewed && (
                <div className="text-sm text-main-gray text-left mt-1">
                  Seen
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
