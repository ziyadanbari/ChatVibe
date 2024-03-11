import { logout } from "@/lib/logout.js";
import { LogOut } from "lucide-react";

export default function Logout() {
  return (
    <div
      onClick={async () => {
        await logout();
        window.location.reload();
      }}
      className="text-red-500 hover:bg-main-dark-gray px-2 rounded-sm flex items-center gap-2 font-medium h-14 cursor-pointer">
      <div>
        <LogOut size={26} />
      </div>
      <div className="text-lg tracking-wide">Logout</div>
    </div>
  );
}
