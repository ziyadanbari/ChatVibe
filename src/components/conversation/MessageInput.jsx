import { Plus, Send } from "lucide-react";
import { Input } from "../ui/input.jsx";
import MicRecorder from "./MicRecorder.jsx";
import { useContext, useState } from "react";
import useSocket from "@/hooks/useSocket.js";
import { ConversationContext } from "@/pages/conversation/page.jsx";
import { Button } from "../ui/button.jsx";
import { messagesIcons, messagesType } from "@/constants/index.jsx";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu.jsx";
import { UserOption } from "../userOptions.jsx";
import { validateImage } from "image-validator";
import { validateVideo } from "@/lib/validateVideo.js";

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
  const [isMediaOptionOpen, setIsMediaOptionOpen] = useState(false);
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
  const options = [
    {
      label: "Image",
      icon: <messagesIcons.image size={28} className="text-main-blue" />,
      htmlFor: "image_upload",
    },
    {
      label: "Video",
      icon: <messagesIcons.video size={28} className="text-indigo-500" />,
      htmlFor: "video_upload",
    },
  ];
  const onFileChange = async (e, checkCallback, messageType) => {
    const files = [...e.target.files];

    const validFiles = [];
    await Promise.all(
      files.map(async (file) => {
        let isValid;
        if (checkCallback && checkCallback instanceof Function) {
          isValid = await checkCallback(file);
        }
        if (isValid) {
          validFiles.push(file);
        }
      })
    );
    socket.emit("send_message", {
      conversationId: conversation._id,
      message: validFiles,
      messageType,
    });
  };
  return (
    <div className="bg-main-black h-14 md:px-6 px-2 py-2">
      <input
        type="file"
        id="image_upload"
        accept="image/*"
        hidden
        multiple
        onChange={(e) =>
          onFileChange(
            e,
            async (image) => await validateImage(image, { throw: false }),
            messagesType.image
          )
        }
      />
      <input
        type="file"
        id="video_upload"
        accept="video/*"
        multiple
        hidden
        onChange={(e) =>
          onFileChange(
            e,
            async (video) => validateVideo(video),
            messagesType.video
          )
        }
      />
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
            <DropdownMenu
              open={isMediaOptionOpen}
              onOpenChange={(open) => setIsMediaOptionOpen(open)}>
              <DropdownMenuTrigger
                className={`outline-none hover:bg-main-dark-gray rounded-full p-1 transition-[transform] duration-200 ${
                  isMediaOptionOpen ? "rotate-45" : "rotate-0"
                }`}>
                <Plus />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mb-3" align="end">
                {options.map(({ icon, label, htmlFor, ...args }, index) => (
                  <DropdownMenuItem key={index} {...args}>
                    <label
                      className="w-full h-full cursor-pointer"
                      htmlFor={htmlFor}>
                      <UserOption
                        icon={icon}
                        label={label}
                        className={"text-base"}
                      />
                    </label>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </ExtraChatOption>
          <Button className="bg-main-blue rounded-lg flex items-center justify-center cursor-pointer hover:bg-main-blue/70 text-white p-2">
            <Send />
          </Button>
        </div>
      </form>
    </div>
  );
}
