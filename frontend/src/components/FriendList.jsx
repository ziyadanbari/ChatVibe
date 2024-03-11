import useSession from "@/hooks/useSession.js";
import UserPaper from "./UserPaper.jsx";
import { NavLink } from "react-router-dom";

export default function FriendList() {
  const { session } = useSession();
  const { friends } = session || {};
  return (
    <div className="h-full ">
      {friends && friends.length ? (
        <div>
          {friends.map((friend) => {
            const { conversationId, lastMessage } = friend;
            const { username, profile_pic, _id, status, lastActiveTime } =
              friend.user || {};
            if (!_id) return null;
            return (
              <NavLink to={`/conversation/${conversationId}`} key={_id}>
                <UserPaper
                  username={username}
                  profile_pic={profile_pic}
                  status={"friend"}
                  isOnline={status === "online"}
                  lastActiveTime={lastActiveTime}
                  lastMessage={lastMessage}
                />
              </NavLink>
            );
          })}
        </div>
      ) : (
        <div className="h-full flex justify-center items-center text-xl font-semibold">
          No friend found
        </div>
      )}
    </div>
  );
}
