import useSession from "@/hooks/useSession.js";
import { ConversationContext } from "@/pages/conversation/page.jsx";
import React, { useContext, useEffect, useRef } from "react";
import Message from "./Message.jsx";

export default function MessagesBody({ user }) {
  const { conversation } = useContext(ConversationContext) || {};
  const { session } = useSession();
  const { messages } = conversation || {};
  const conversationBodyRef = useRef(null);
  useEffect(() => {
    if (!conversationBodyRef.current || !messages?.length) return;
    conversationBodyRef.current.scrollTop =
      conversationBodyRef.current.scrollHeight;
  }, [messages]);
  return (
    <div
      className="flex-1 overflow-auto md:px-10 px-2 py-4"
      ref={conversationBodyRef}>
      <div className="flex flex-col gap-8">
        <div className="text-center text-sm text-main-gray">
          Start chatting with{" "}
          <span className="font-bold capitalize">{user?.username}</span>{" "}
          securely
        </div>
        <div className="flex flex-col h-full gap-8">
          {conversation?.messages &&
            conversation?.messages?.map((message, i) => {
              const {
                owner,
                message: { messageType, messageContent },
                sendAt,
                viewed,
                emitted,
                messageId,
              } = message;
              const isSender = owner._id === session._id;
              return (
                <Message
                  key={i}
                  owner={owner}
                  messageType={messageType}
                  messageContent={messageContent}
                  sendAt={sendAt}
                  viewed={viewed}
                  emitted={emitted}
                  isSender={isSender}
                  messageId={messageId}
                  isTheLastMessage={
                    messageId === conversation.messages.slice(-1)[0]?.messageId
                  }
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
