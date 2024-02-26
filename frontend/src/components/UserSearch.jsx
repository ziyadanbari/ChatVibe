import React, { useEffect, useState } from "react";
import { Input } from "./ui/input.jsx";
import { Search } from "lucide-react";
import { toasty } from "@/lib/toasty.js";
import { axiosInstance } from "@/config/axiosInstance.js";
import { searchUser } from "@/config/api.js";
import UserPaper from "./UserPaper.jsx";

export default function UserSearch() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState(null);
  useEffect(() => {
    async function searchForUser() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          searchUser.replace(":user", query)
        );
        setSearchedUsers(response?.data?.users);
      } catch (error) {
        toasty("error", error);
      } finally {
        setLoading(false);
      }
    }
    if (query) searchForUser();
  }, [query]);
  return (
    <div className="h-full px-2 pb-5">
      <div className="flex flex-col gap-3 h-full">
        <div>
          <Input
            type={"text"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={"Search for friends..."}
            className={"pl-8 pr-2"}
            domBefore={
              <div className="absolute mx-2 text-main-gray">
                <Search size={19} />
              </div>
            }
          />
        </div>
        <div className="overflow-auto h-full pr-2">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <UserPaper key={i} />)
            : searchedUsers instanceof Array
            ? searchedUsers?.length
              ? searchedUsers.map((user) => {
                  return (
                    <UserPaper
                      username={user.username}
                      profile_pic={user.profile_pic}
                      key={user._id}
                    />
                  );
                })
              : "No user found"
            : null}
        </div>
      </div>
    </div>
  );
}
