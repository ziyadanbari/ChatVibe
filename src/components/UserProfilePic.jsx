import { Avatar, AvatarImage } from "./ui/avatar.jsx";
import { Badge } from "./ui/badge.jsx";
import { Skeleton } from "./ui/skeleton.jsx";

export default function UserProfilePic({
  profile_pic,
  className,
  isOnline,
  showStatus,
}) {
  return (
    <div className="relative">
      <Avatar className={className || `h-12 w-12`}>
        {profile_pic ? (
          <AvatarImage src={profile_pic} />
        ) : (
          <Skeleton className={"w-full h-full"} />
        )}
      </Avatar>
      {isOnline !== undefined && (
        <Badge
          className={`${
            isOnline ? "bg-main-blue" : "bg-main-gray"
          } rounded-full absolute bottom-0 right-0 w-3 h-3 !p-0`}></Badge>
      )}
    </div>
  );
}
