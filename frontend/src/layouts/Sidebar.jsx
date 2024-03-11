import UserSearch from "@/components/UserSearch.jsx";
import { useEffect, useState } from "react";
import UserPaper from "@/components/UserPaper.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSearchResult from "@/components/UserSearchResult.jsx";
import FriendsRequests from "@/components/FriendsRequests.jsx";
import FriendList from "@/components/FriendList.jsx";
import Logout from "@/components/Logout.jsx";
import useSession from "@/hooks/useSession.js";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator.jsx";

function TabTrigger({ children, currentTab, value, ...props }) {
  return (
    <TabsTrigger
      value={value}
      className={`!bg-transparent border-b-2 border-main-gray !rounded-none ${
        currentTab === value && "!border-main-blue"
      }`}
      {...props}>
      {children}
    </TabsTrigger>
  );
}

export default function Sidebar() {
  const tabs = {
    friendList: "friend_list",
    friendRequest: "friend_request",
    searchedResult: "search_result",
  };
  const { session } = useSession();
  const [searchedUsers, setSearchedUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(tabs.friendList);
  useEffect(() => {
    if (!searchedUsers || !searchedUsers?.length) setTab(tabs.friendList);
    else setTab(tabs.searchedResult);
  }, [searchedUsers]);
  return (
    <div className=" w-full  h-full bg-main-black px-2 pb-4  flex flex-col gap-3 pt-12 md:pt-4">
      {/* <div>
        <UserOptions />
      </div> */}
      <UserSearch setSearchedUsers={setSearchedUsers} setLoading={setLoading} />
      <div className="h-full px-2">
        <Tabs
          value={tab}
          className="h-full"
          onValueChange={(data) => setTab(data)}>
          <TabsList className="w-full flex items-center gap-1 bg-transparent">
            <TabTrigger value={tabs.friendList} currentTab={tab}>
              Friends
            </TabTrigger>

            <TabTrigger value={tabs.friendRequest} currentTab={tab}>
              Requests
            </TabTrigger>
          </TabsList>
          <div className="flex flex-col gap-3 h-full">
            <div className="overflow-y-auto overflow-x-hidden h-full">
              <TabsContent value={tabs.searchedResult}>
                <UserSearchResult
                  searchedUsers={searchedUsers}
                  loading={loading}
                />
              </TabsContent>
              <TabsContent value={tabs.friendList}>
                <FriendList />
              </TabsContent>
              <TabsContent value={tabs.friendRequest}>
                <FriendsRequests />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
      <div>
        <div className="relative">
          <div className="absolute w-full top-2/4 z-0">
            <Separator className="bg-main-gray/60" />
          </div>
          <div className="text-main-gray bg-main-black z-10 relative inline-block mx-3 px-2">
            Profile
          </div>
        </div>
        <div>
          <Link to={"/profile"}>
            <UserPaper
              profile_pic={session.profile_pic}
              username={`${session.username} (You)`}
              CustomAction={<></>}
            />
          </Link>
          <div>
            <Logout />
          </div>
        </div>
      </div>
    </div>
  );
}
