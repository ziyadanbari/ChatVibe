import React, { useContext } from "react";
import UserProfilePic from "../UserProfilePic.jsx";
import { formatTimeToAMPM } from "@/lib/convertTimeToAMPM.js";
import AudioPlayer from "./AudioPlayer.jsx";
import useSocket from "@/hooks/useSocket.js";
import { ConversationContext } from "@/pages/conversation/page.jsx";
import { HardDriveDownload, Trash } from "lucide-react";
import ImageMessage from "./Image.jsx";
import { messagesType } from "@/constants/index.jsx";
import { base64ToBlobUrl } from "@/lib/base64ToBlobUrl.js";
import VideoMessage from "./Video.jsx";

export default function Message({
  owner,
  messageContent,
  messageType,
  sendAt,
  viewed,
  emitted,
  isSender,
  isTheLastMessage,
  messageId,
}) {
  const { profile_pic, username } = owner;
  const { socket } = useSocket();
  const { conversation } = useContext(ConversationContext);
  const deleteMessage = async () => {
    socket.emit("delete_message", {
      conversationId: conversation._id,
      messageId,
    });
  };

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
            <div className="flex items-center gap-1">
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
                  ) : messageType === "image" ? (
                    <ImageMessage src={messageContent} />
                  ) : messageType === "video" ? (
                    <VideoMessage src={messageContent} />
                  ) : null}
                </div>
                {isTheLastMessage && isSender && viewed && (
                  <div className="text-sm text-main-gray text-left mt-1">
                    Seen
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4 items-center">
                {isSender && (
                  <div className="cursor-pointer" onClick={deleteMessage}>
                    <Trash className="text-red-500" size={18} />
                  </div>
                )}
                {[messagesType.image, messagesType.video].includes(
                  messageType
                ) ? (
                  <div>
                    <a
                      href={base64ToBlobUrl(
                        messageContent,
                        messageType === messagesType.image
                          ? "image/jpg"
                          : "video/mp4"
                      )}
                      download={`${Date.now()}.${
                        messageType === messagesType.image ? "jpg" : "mp4"
                      }`}>
                      <HardDriveDownload size={18} />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
