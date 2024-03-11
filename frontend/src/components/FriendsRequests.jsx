import useSession from "@/hooks/useSession.js";
import React from "react";
import UserPaper from "./UserPaper.jsx";

export default function FriendsRequests() {
  const { session } = useSession();
  const { friendWaitList } = session || {};

  return (
    <div className="h-full ">
      {friendWaitList && friendWaitList.length ? (
        <div>
          {friendWaitList.map((request) => {
            const { _id: requestId } = request;
            const { username, profile_pic, _id } = request.user || {};
            if (!_id) return;
            return (
              <UserPaper
                requestId={requestId}
                username={username}
                profile_pic={profile_pic}
                status={"inWaitList"}
                key={_id}
              />
            );
          })}
        </div>
      ) : (
        <div className="h-full flex justify-center items-center text-xl font-semibold">
          No request found
        </div>
      )}
    </div>
  );
}
