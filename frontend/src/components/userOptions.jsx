import useSession from "@/hooks/useSession.js";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userOptions } from "@/constants/index.jsx";
import { Link } from "react-router-dom";

export function UserOption({ icon, label }) {
  return (
    <div className="flex items-center gap-2 font-semibold">
      <div>{icon}</div>
      <div>{label}</div>
    </div>
  );
}

export default function UserOptions() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center">
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {userOptions.map(({ label, icon, Component, ...props }) => {
            const Comp = Component || Link;
            return (
              <Comp {...props} key={label}>
                <DropdownMenuItem>
                  <UserOption label={label} icon={icon} />
                </DropdownMenuItem>
              </Comp>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
