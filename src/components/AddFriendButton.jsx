import React from "react";
import { Button } from "./ui/button.jsx";
import { UserRoundPlus } from "lucide-react";

export default function AddFriendButton() {
  return (
    <Button
      size="icon"
      className="bg-transparent hover:bg-main-gray/30 text-white">
      <UserRoundPlus />
    </Button>
  );
}
