import { baseURL } from "@/config/api.js";
import useSession from "@/hooks/useSession.js";
import { logout } from "@/lib/logout.js";
import { LogOut, UserRound } from "lucide-react";

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

export const googleOAuthUrl = `${baseURL}/auth/google`;
