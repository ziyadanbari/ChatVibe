import MessageInput from "@/components/conversation/MessageInput.jsx";
import MessagesBody from "@/components/conversation/MessagesBody.jsx";
import UserProfileHeader from "@/components/conversation/UserProfileHeader.jsx";
import { getConversation } from "@/config/api.js";
import { axiosInstance } from "@/config/axiosInstance.js";
import useSession from "@/hooks/useSession.js";
import useSocket from "@/hooks/useSocket.js";
import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ConversationContext = createContext();
export default function Conversation() {
  const { socket } = useSocket();
  const { conversationId } = useParams();
  const { session } = useSession();
  const [conversation, setConversation] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useLayoutEffect(() => {
    async function fetchConversation() {
      try {
        const response = await axiosInstance.get(
          getConversation.replace(":id", conversationId)
        );
        return response.data;
      } catch (error) {
        navigate("/");
      }
    }
    fetchConversation().then((conversation) => setConversation(conversation));
  }, [conversationId, setConversation, session]);
  useEffect(() => {
    if (!conversation && !Object.keys(conversation || {}).length) return;
    const member = conversation?.members?.find(
      (member) => member.user._id !== session._id
    );
    if (member) setUser(member.user);
  }, [conversation]);
  useEffect(() => {
    const handleNewMessage = async (data) => {
      console.log(123);
      if (data.conversationId !== conversationId) return;
      setConversation((prevConversation) => {
        const updatedMessages = [
          ...prevConversation.messages,
          {
            ...data,
          },
        ];

        return {
          ...prevConversation,
          messages: updatedMessages,
        };
      });
      // socket.emit("messages_viewed", { conversationId });
    };
    const handleMessageEmitted = async (data) => {
      if (data.conversationId !== conversationId) return;
      setConversation((prevConversation) => {
        const updatedMessages = [
          ...prevConversation.messages,
          {
            emitted: data.status === "emitted",
            ...data,
          },
        ];

        return {
          ...prevConversation,
          messages: updatedMessages,
        };
      });
    };
    const messagesViewed = async (data) => {
      if (data.conversationId !== conversationId) return;
      setConversation((prevConversation) => {
        return {
          ...prevConversation,
          messages: prevConversation?.messages?.map((message) => ({
            ...message,
            viewed: true,
          })),
        };
      });
    };
    socket.on("message_emitted", handleMessageEmitted);
    socket.on("new_message", handleNewMessage);
    socket.on("messages_viewed", messagesViewed);
    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_emitted", handleMessageEmitted);
      socket.off("messages_viewed", messagesViewed);
    };
  }, [socket]);

  return (
    <ConversationContext.Provider value={{ conversation, setConversation }}>
      <div className="h-full">
        <div className="h-full flex flex-col">
          <div>
            <UserProfileHeader
              username={user?.username}
              profile_pic={user?.profile_pic}
              isOnline={user?.status === "online"}
              lastActiveTime={user?.lastActiveTime}
              _id={user?._id}
            />
          </div>
          <MessagesBody />
          <div>
            <MessageInput />
          </div>
        </div>
      </div>
    </ConversationContext.Provider>
  );
}
