import { baseURL } from "@/config/api.js";
import useSession from "@/hooks/useSession.js";
import useSocket from "@/hooks/useSocket.js";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function SocketProvider({ children }) {
  const { socket, setSocket } = useSocket();
  const { session, setSession, refreshSession } = useSession();
  useEffect(() => {
    function connect() {
      const socket = io(baseURL, {
        extraHeaders: {
          auth: localStorage.getItem("token"),
        },
      });
      setSocket(socket);
    }
    if (localStorage.getItem("token") && session && socket) return;
    connect();
  }, [session, setSession]);
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = async (data) => {
      const { conversationId } = data;
      data = { ...data, conversationId: undefined };
      setSession((session) => {
        const friends = session?.friends?.map((friend) => {
          if (friend?.conversationId !== conversationId) return friend;
          return { ...friend, lastMessage: { ...data } };
        });
        return { ...session, friends };
      });
    };

    socket.on("refresh", refreshSession);
    socket.on("new_message", handleNewMessage);
    socket.on("message_emitted", handleNewMessage);
    return () => {
      socket.off("refresh", refreshSession);
      socket.off("new_message", handleNewMessage);
      socket.off("message_emitted", handleNewMessage);
    };
  }, [setSocket, socket]);
  return children;
}
