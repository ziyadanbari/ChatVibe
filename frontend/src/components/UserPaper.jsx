import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage } from "./ui/avatar.jsx";

export default function UserPaper({ profile_pic, username }) {
  return (
    <div className="p-2 rounded-sm hover:bg-main-dark-gray cursor-pointer">
      <div className="flex items-center gap-3">
        <div>
          <Avatar>
            {profile_pic ? (
              <AvatarImage src={profile_pic} />
            ) : (
              <Skeleton className={"w-full h-full"} />
            )}
          </Avatar>
        </div>
        <div className="flex-1">
          {username || <Skeleton className={"w-full h-2 rounded-full"} />}
        </div>
      </div>
    </div>
  );
}
