import { Link, Send } from "lucide-react";
import { Input } from "../ui/input.jsx";
import MicRecorder from "./MicRecorder.jsx";
import { useContext, useEffect, useState } from "react";
import useSocket from "@/hooks/useSocket.js";
import { ConversationContext } from "@/pages/conversation/page.jsx";
import { Button } from "../ui/button.jsx";
import { messagesType } from "@/constants/index.jsx";

function ExtraChatOption({ children, className, ...props }) {
  return (
    <div className={`cursor-pointer ${className}`} {...props}>
      {children}
    </div>
  );
}

export default function MessageInput() {
  const { conversation } = useContext(ConversationContext);
  const [message, setMessage] = useState("");
  const { socket } = useSocket();
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;
    socket.emit("send_message", {
      conversationId: conversation._id,
      message,
      messageType: messagesType.text,
    });
    setMessage("");
  };
  return (
    <div className="bg-main-black h-14 md:px-6 px-2 py-2">
      <form
        className="w-full h-full flex items-center gap-2"
        onSubmit={sendMessage}>
        <div className="flex-1">
          <Input
            placeholder="Type message..."
            value={message}
            onChange={({ target: { value } }) => setMessage(value)}
            className="bg-transparent border-none outline-none text-base"
          />
        </div>
        <div className="flex items-center gap-4">
          <ExtraChatOption>
            <MicRecorder />
          </ExtraChatOption>
          <ExtraChatOption>
            <Link />
          </ExtraChatOption>
          <Button className="bg-main-blue p-1 rounded-lg flex items-center justify-center cursor-pointer hover:bg-main-blue/70 text-white">
            <Send />
          </Button>
        </div>
      </form>
    </div>
  );
}
