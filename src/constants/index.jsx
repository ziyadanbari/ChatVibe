import { baseURLApi } from "@/config/api.js";
import { logout } from "@/lib/logout.js";
import {
  AudioLines,
  File,
  Image,
  LogOut,
  MessageCircleMore,
  UserRound,
  Video,
} from "lucide-react";

export const userOptions = [
  {
    label: "Profile",
    icon: <UserRound />,
    to: "/profile",
  },
  {
    label: "Logout",
    icon: <LogOut />,
    async onClick() {
      await logout();
      window.location.reload();
    },
    Component: "div",
    className: "text-red-500",
  },
];

export const googleOAuthUrl = `${baseURLApi}/auth/google`;
export const messagesType = {
  audio: "audio",
  text: "text",
  image: "image",
  video: "video",
  file: "file",
};
export const messagesIcons = {
  audio: AudioLines,
  text: MessageCircleMore,
  image: Image,
  video: Video,
  file: File,
};
