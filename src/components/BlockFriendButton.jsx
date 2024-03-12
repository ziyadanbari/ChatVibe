import { Ban } from "lucide-react";
import { Button } from "./ui/button.jsx";

export default function BlockFriendButton() {
  return (
    <Button className="bg-transparent hover:bg-main-gray/30 text-white">
      <Ban />
    </Button>
  );
}
